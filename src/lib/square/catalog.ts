import { Client, Environment } from 'square';
import { MenuData, MenuItem } from '@/types/menu';

// Initialize Square client
const initSquareClient = () => {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const environment = process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox;

  if (!accessToken) {
    throw new Error('Square access token is not configured');
  }

  return new Client({
    accessToken,
    environment,
  });
};

// Get location ID from env
const getLocationId = (): string => {
  const locationId = process.env.SQUARE_LOCATION_ID;
  
  if (!locationId) {
    throw new Error('Square location ID is not configured');
  }
  
  return locationId;
};

// Fetch menu items from Square Catalog API
export async function getMenuItems(): Promise<MenuData> {
  try {
    const squareClient = initSquareClient();
    const locationId = getLocationId();
    const catalogApi = squareClient.catalogApi;
    
    // Fetch all categories
    const categoriesResponse = await catalogApi.listCatalog(
      undefined,
      'CATEGORY'
    );
    
    const categories = categoriesResponse.result.objects
      ?.filter(obj => obj.type === 'CATEGORY')
      .map(obj => ({
        id: obj.id!,
        name: obj.categoryData!.name!,
      })) || [];
    
    // Create category map for easy lookups
    const categoryMap = new Map(
      categories.map(category => [category.id, category.name])
    );
    
    // Fetch all items for the location
    const itemsResponse = await catalogApi.searchCatalogItems({
      enabledLocationIds: [locationId]
    });
    
    // Create a map of image IDs to image URLs
    const imageUrlMap = new Map<string, string>();
    
    // Collect all image IDs from items
    const imageIds: string[] = [];
    itemsResponse.result.items?.forEach(item => {
      if (item.itemData?.imageIds && item.itemData.imageIds.length > 0) {
        imageIds.push(...item.itemData.imageIds);
      }
    });
    
    // Fetch image objects if we have IDs
    if (imageIds.length > 0) {
      // Batch retrieve image objects
      const batchResponse = await catalogApi.batchRetrieveCatalogObjects({
        objectIds: imageIds
      });
      
      // Process the image objects to build our URL map
      if (batchResponse.result.objects) {
        batchResponse.result.objects.forEach(obj => {
          if (obj.type === 'IMAGE' && obj.imageData?.url) {
            imageUrlMap.set(obj.id as string, obj.imageData.url);
          }
        });
      }
    }
    
    // Transform the catalog items into our MenuItem format
    const items = itemsResponse.result.items
      ?.map(item => {
        const variations = item.itemData?.variations
          ?.map(variation => ({
            id: variation.id!,
            name: variation.itemVariationData?.name || 'Regular',
            price_money: variation.itemVariationData?.priceMoney || {
              amount: 0,
              currency: 'USD',
            },
          })) || [];
          
        // Get image URL if available
        let imageUrl;
        
        // Check if we have the image URL in our map
        if (item.itemData?.imageIds && item.itemData.imageIds.length > 0) {
          const imageId = item.itemData.imageIds[0];
          imageUrl = imageUrlMap.get(imageId);
        }
        
        // If no image is found, use a default placeholder
        if (!imageUrl) {
          imageUrl = '/images/menu-placeholder.jpg';
        }
        
        // Get category ID and name
        const categoryId = item.itemData?.categoryId;
        const categoryName = categoryId ? categoryMap.get(categoryId) : undefined;
        
        return {
          id: item.id!,
          name: item.itemData?.name || 'Unnamed Item',
          description: item.itemData?.description,
          image_url: imageUrl,
          category_id: categoryId,
          category_name: categoryName,
          variations,
        } as MenuItem;
      })
      .filter(item => item.variations && item.variations.length > 0) || [];
    
    return {
      items,
      categories,
    };
  } catch (error) {
    console.error('Error fetching menu items from Square:', error);
    throw new Error('Failed to load menu items');
  }
}
