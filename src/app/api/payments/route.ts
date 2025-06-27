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
    const { orderId, sourceId, customerDetails } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    if (!sourceId) {
      return NextResponse.json(
        { error: 'Payment source ID is required' },
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
    
    // First, retrieve the order to get the current amount
    const orderResult = await squareClient.ordersApi.retrieveOrder(orderId);
    
    if (!orderResult.result.order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const order = orderResult.result.order;
    const totalMoney = order.netAmountDueMoney || order.totalMoney;
    
    if (!totalMoney) {
      return NextResponse.json(
        { error: 'Invalid order amount' },
        { status: 400 }
      );
    }
    
    // Create unique idempotency key for this payment
    const idempotencyKey = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Process payment for the order
    const paymentResponse = await squareClient.paymentsApi.createPayment({
      sourceId,
      idempotencyKey,
      amountMoney: totalMoney,
      orderId,
      // Add customer to payment if we have details
      buyerEmailAddress: customerDetails?.email,
      locationId,
      autocomplete: true, // Auto-complete the payment (no further capture needed)
    });
    
    if (!paymentResponse.result.payment) {
      throw new Error('Payment processing failed');
    }
    
    // Update order status to show it's been paid
    await squareClient.ordersApi.updateOrder(orderId, {
      order: {
        state: 'COMPLETED',
        version: order.version,
      },
      idempotencyKey: `order_update_${idempotencyKey}`,
    });
    
    // Return payment confirmation details
    return NextResponse.json({
      paymentId: paymentResponse.result.payment.id,
      status: paymentResponse.result.payment.status,
      orderId: paymentResponse.result.payment.orderId,
      receiptUrl: paymentResponse.result.payment.receiptUrl,
      amount: paymentResponse.result.payment.totalMoney,
    });
  } catch (error: any) {
    console.error('Error processing payment:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process payment' },
      { status: 500 }
    );
  }
}
