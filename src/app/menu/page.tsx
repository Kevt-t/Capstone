import { notFound } from 'next/navigation';
import { getMenuItems } from '@/lib/square/catalog';
import MenuFiltered from '@/components/menu/MenuFiltered';

// Using ISR with revalidation as specified in the architecture
export const revalidate = 600; // Revalidate every 10 minutes

export default async function MenuPage() {
  // Fetch menu data from Square Catalog API
  const menuData = await getMenuItems();
  
  if (!menuData || !menuData.items) {
    notFound();
  }
  
  // Group items by category for display
  const categories = [...new Set(menuData.items
    .filter(item => item.category_name)
    .map(item => item.category_name))] as string[];
  
  return (
    <div className="container mx-auto">
      <MenuFiltered menuData={menuData} />
    </div>
  );
}
