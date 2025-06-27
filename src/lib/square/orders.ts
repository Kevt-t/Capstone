import { Client, Environment } from 'square';
import { CartItem } from '@/types/cart';

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

// Create a new order in Square
export async function createOrder(cartItems: CartItem[], customerData?: any) {
  try {
    const squareClient = initSquareClient();
    const locationId = getLocationId();
    
    // Transform cart items to Square line items
    const lineItems = cartItems.map(item => ({
      quantity: item.quantity.toString(),
      catalogObjectId: item.id,
      modifiers: item.modifiers?.map(mod => ({
        catalogObjectId: mod.id,
      })),
    }));
    
    // Create order request
    const orderRequest = {
      order: {
        locationId,
        lineItems,
        state: 'OPEN',
        serviceCharges: [
          {
            name: 'Convenience Fee',
            amountMoney: {
              amount: 100, // $1.00 fee
              currency: 'USD',
            },
            calculationPhase: 'TOTAL_PHASE',
            taxable: false,
          },
        ],
        // Add customer info if available
        customerId: customerData?.customerId,
        source: {
          name: 'Online Ordering Website',
        },
        metadata: {
          orderType: 'PICKUP',
        },
        pricingOptions: {
          autoApplyTaxes: true,
        },
      },
      idempotencyKey: `order_${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`,
    };
    
    // Create the order in Square
    const response = await squareClient.ordersApi.createOrder(orderRequest);
    
    if (!response.result.order) {
      throw new Error('Failed to create order');
    }
    
    return {
      orderId: response.result.order.id,
      totalMoney: response.result.order.totalMoney,
      netAmountDueMoney: response.result.order.netAmountDueMoney,
    };
  } catch (error) {
    console.error('Error creating order in Square:', error);
    throw new Error('Failed to create order');
  }
}
