import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment } from 'square';

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

export async function POST(request: NextRequest) {
  try {
    // Parse and log the request body
    const requestBody = await request.json();
    console.log('Request body received:', JSON.stringify(requestBody, null, 2));
    
    const { items, customer, pickup, pickupNotes } = requestBody;
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided in order' },
        { status: 400 }
      );
    }
    
    const squareClient = initSquareClient();
    const locationId = process.env.SQUARE_LOCATION_ID;
    
    if (!locationId) {
      return NextResponse.json(
        { error: 'Square location ID not configured' },
        { status: 500 }
      );
    }
    
    // Create unique idempotency key for this order
    const idempotencyKey = `order_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Map cart items to Square line items
    const lineItems = items.map((item: any) => ({
      quantity: item.quantity.toString(),
      catalogObjectId: item.id,
      note: item.variationName || undefined,
    }));
    
    // Always include a pickup_at timestamp for all orders
    // This prevents the 400 error from missing required fields
    
    // For scheduled pickup, use the customer-selected time
    // For ASAP pickup, use the current time
    let pickupAtTimestamp: string;
    
    if (pickup && pickup.type === 'SCHEDULED' && pickup.time) {
      // If customer scheduled a specific time, use that
      console.log(`Using customer-selected scheduled pickup time: ${pickup.time}`);
      pickupAtTimestamp = pickup.time;
    } else {
      // For ASAP orders, use current time as the pickup timestamp
      pickupAtTimestamp = new Date().toISOString();
      console.log(`Using current time for ASAP pickup: ${pickupAtTimestamp}`);
    }
    
    console.log('Using pickup_at timestamp:', pickupAtTimestamp);
    
    // Define the type for pickup details using camelCase as expected by Square SDK
    type PickupDetails = {
      note?: string;
      recipient: {
        displayName: string;
        emailAddress: string;
        phoneNumber: string;
      };
      pickupAt: string; // Always include pickupAt for all orders (camelCase for SDK)
    };
    
    // Create the pickup details with the always-included pickupAt timestamp
    const pickupDetails: PickupDetails = {
      note: pickupNotes || undefined,
      recipient: {
        displayName: `${customer.firstName} ${customer.lastName}`,
        emailAddress: customer.email,
        phoneNumber: customer.phone,
      },
      pickupAt: pickupAtTimestamp // Always include this for all orders
    };
    
    console.log('Final pickup details being sent to Square:', JSON.stringify(pickupDetails, null, 2));
    
    // Create the complete order request body for the Square SDK
    // Note: Square SDK expects camelCase in the TypeScript interface
    // and handles the conversion to snake_case for the API internally
    const orderBody = {
      order: {
        locationId,
        lineItems,
        state: 'OPEN',
        fulfillments: [
          {
            type: 'PICKUP',
            state: 'PROPOSED',
            pickupDetails: {
              recipient: {
                displayName: pickupDetails.recipient.displayName,
                emailAddress: pickupDetails.recipient.emailAddress,
                phoneNumber: pickupDetails.recipient.phoneNumber,
              },
              // The crucial field that needs to be included for all pickups
              pickupAt: pickupDetails.pickupAt,  
              note: pickupDetails.note
            },
          },
        ],
        metadata: {
          orderSource: 'Online Ordering Site'
        },
      },
      idempotencyKey: `order_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
    };
    
    // Log the complete order request to verify pickup_at is present
    console.log('Complete Square order request:', JSON.stringify(orderBody, null, 2));
    
    // Create order in Square
    const orderResponse = await squareClient.ordersApi.createOrder(orderBody);
    
    if (!orderResponse.result.order) {
      throw new Error('Failed to create order');
    }
    
    // Convert BigInt values to numbers before serialization
    // Square SDK sometimes returns money amounts as BigInt which can't be serialized to JSON
    const totalAmount = orderResponse.result.order.totalMoney?.amount
      ? Number(orderResponse.result.order.totalMoney.amount)
      : 0;
    
    // Return order details needed for payment with serializable values
    return NextResponse.json({
      orderId: orderResponse.result.order.id,
      orderVersion: orderResponse.result.order.version,
      totalAmount, // Using the converted number value
      paymentDetails: {
        amount: totalAmount, // Using the converted number value
        currency: orderResponse.result.order.totalMoney?.currency || 'USD',
      },
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
