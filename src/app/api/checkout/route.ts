import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment } from 'square';
import { randomUUID } from 'crypto';

// TypeScript interfaces for request data
interface CartItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
  variationName?: string;
}

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PickupDetails {
  type: 'ASAP' | 'SCHEDULED';
  time?: string;
}

interface OrderDetails {
  items: CartItem[];
  customer: CustomerDetails;
  pickup: PickupDetails;
  pickupNotes?: string;
}

interface PaymentDetails {
  sourceId: string;
  amount: number;
}

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

interface CheckoutRequestBody {
  orderDetails: OrderDetails;
  paymentDetails: PaymentDetails;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout request received');
    const requestBody = await request.json() as CheckoutRequestBody;
    const { orderDetails, paymentDetails } = requestBody;
    
    // Validate required data
    if (!orderDetails?.items || orderDetails.items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      );
    }
    
    if (!paymentDetails?.sourceId) {
      return NextResponse.json(
        { error: 'Payment source ID is required' },
        { status: 400 }
      );
    }
    
    const squareClient = initSquareClient();
    const locationId = process.env.SQUARE_LOCATION_ID;
    
    if (!locationId) {
      return NextResponse.json(
        { error: 'Square location ID is not configured' },
        { status: 500 }
      );
    }
    
    console.log('Request body received:', JSON.stringify(orderDetails, null, 2));
    
    // Generate idempotency keys - unique per request
    const orderIdempotencyKey = `order_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // STEP 1: Create Square line items from cart items
    const lineItems = orderDetails.items.map((item: CartItem) => ({
      quantity: item.quantity.toString(),
      catalogObjectId: item.id,  // This is the Square catalog item ID
      note: item.variationName || undefined
    }));

    // Set pickup time for fulfillment
    let pickupAt;
    
    if (orderDetails.pickup.type === 'ASAP') {
      // For ASAP orders, use current time plus 15 minutes
      const now = new Date();
      now.setMinutes(now.getMinutes() + 15); // 15 minute buffer
      pickupAt = now.toISOString();
      console.log(`Using current time for ASAP pickup: ${pickupAt}`);
    } else if (orderDetails.pickup.type === 'SCHEDULED' && orderDetails.pickup.time) {
      // For scheduled pickups, use the selected time
      pickupAt = orderDetails.pickup.time;
    } else {
      return NextResponse.json(
        { error: 'Invalid pickup type or missing scheduled time' },
        { status: 400 }
      );
    }
    
    console.log(`Using pickup_at timestamp: ${pickupAt}`);
    
    // Create fulfillment object for pickup details
    const fulfillmentDetails = {
      type: 'PICKUP',
      state: 'PROPOSED',
      pickupDetails: {
        recipient: {
          displayName: `${orderDetails.customer.firstName} ${orderDetails.customer.lastName}`,
          emailAddress: orderDetails.customer.email,
          phoneNumber: orderDetails.customer.phone
        },
        pickupAt
      }
    };
    
    console.log('Final pickup details being sent to Square:', JSON.stringify(fulfillmentDetails.pickupDetails, null, 2));
    
    // Prepare the create order request
    const createOrderRequest = {
      order: {
        locationId,
        lineItems,
        state: 'OPEN',
        fulfillments: [fulfillmentDetails],
        metadata: {
          orderSource: 'Online Ordering Site'
        }
      },
      idempotencyKey: orderIdempotencyKey
    };
    
    console.log('Complete Square order request:', JSON.stringify(createOrderRequest, null, 2));
    
    // STEP 2: Create the order in Square
    const orderResponse = await squareClient.ordersApi.createOrder(createOrderRequest);
    
    if (!orderResponse.result?.order?.id) {
      throw new Error('Failed to create order');
    }
    
    const orderId = orderResponse.result.order.id;
    console.log(`Order created with ID: ${orderId}`);
    
    // STEP 3: Process payment for the newly created order
    const order = orderResponse.result.order;
    const totalMoney = order.netAmountDueMoney || order.totalMoney;
    
    if (!totalMoney) {
      return NextResponse.json(
        { error: 'Invalid order amount' },
        { status: 400 }
      );
    }
    
    // Create unique idempotency key for payment
    const paymentIdempotencyKey = `payment_${randomUUID()}`;
    console.log(`Processing payment for order ${orderId} with idempotency key ${paymentIdempotencyKey}`);
    
    // Log order details before payment
    console.log('Order details:', {
      id: order.id,
      state: order.state,
      totalAmount: Number(totalMoney.amount),
      currency: totalMoney.currency
    });
    
    // Create payment request object
    const paymentRequest = {
      sourceId: paymentDetails.sourceId,
      idempotencyKey: paymentIdempotencyKey,
      amountMoney: totalMoney,
      orderId,
      // Add customer to payment if we have details
      buyerEmailAddress: orderDetails.customer.email,
      locationId,
      autocomplete: true, // Auto-complete the payment (no further capture needed)
    };
    
    // Process payment for the order
    console.log('Sending payment request to Square...');
    
    // Safely log the payment request without BigInt serialization issues
    console.log('Payment request payload:', {
      sourceId: paymentRequest.sourceId,
      idempotencyKey: paymentRequest.idempotencyKey,
      orderId: paymentRequest.orderId,
      amountMoney: {
        amount: Number(paymentRequest.amountMoney?.amount || 0),
        currency: paymentRequest.amountMoney?.currency
      },
      buyerEmailAddress: paymentRequest.buyerEmailAddress,
      locationId: paymentRequest.locationId,
      autocomplete: paymentRequest.autocomplete
    });
    
    const paymentResponse = await squareClient.paymentsApi.createPayment(paymentRequest);
    
    // Log the payment response
    console.log('Payment response received:', {
      success: !!paymentResponse.result.payment,
      paymentId: paymentResponse.result.payment?.id,
      status: paymentResponse.result.payment?.status,
      amount: paymentResponse.result.payment?.amountMoney ? 
        Number(paymentResponse.result.payment.amountMoney.amount || 0) : null,
      currency: paymentResponse.result.payment?.amountMoney?.currency,
      receiptUrl: paymentResponse.result.payment?.receiptUrl
    });
    
    if (!paymentResponse.result.payment) {
      throw new Error('Payment processing failed');
    }
    
    // We're intentionally not updating the order status to COMPLETED
    // This keeps the order in OPEN state with PROPOSED fulfillment
    // so it shows up in Square POS for staff to manually process
    console.log(`Keeping order ${orderId} in OPEN state for staff fulfillment via Square POS`);
    
    // Prepare response data
    const responseData = {
      paymentId: paymentResponse.result.payment.id,
      status: paymentResponse.result.payment.status,
      orderId: paymentResponse.result.payment.orderId,
      receiptUrl: paymentResponse.result.payment.receiptUrl,
      amount: Number(paymentResponse.result.payment.totalMoney?.amount || 0),
      currency: paymentResponse.result.payment.totalMoney?.currency || 'USD',
      cardDetails: paymentResponse.result.payment.cardDetails ? {
        brand: paymentResponse.result.payment.cardDetails.card?.cardBrand || '',
        last4: paymentResponse.result.payment.cardDetails.card?.last4 || ''
      } : null
    };
    
    console.log('Returning payment confirmation to client:', JSON.stringify(responseData, null, 2));
    
    // Return payment confirmation details
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error processing checkout:', error);
    
    // Log detailed error information
    if (error.errors) {
      console.error('Square API error details:', JSON.stringify(error.errors, null, 2));
    }
    
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
    
    if (error.response?.body) {
      try {
        console.error('Response body:', error.response.body);
      } catch (e) {
        console.error('Unable to serialize error response body');
      }
    }
    
    // Return appropriate error response
    return NextResponse.json(
      { error: error.message || 'Failed to complete checkout' },
      { status: error.statusCode || 500 }
    );
  }
}
