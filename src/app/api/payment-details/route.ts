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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get('id');
    
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }
    
    const squareClient = initSquareClient();
    
    console.log(`Retrieving payment details for ID: ${paymentId}`);
    const paymentResponse = await squareClient.paymentsApi.getPayment(paymentId);
    
    if (!paymentResponse.result.payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    const payment = paymentResponse.result.payment;
    
    // Retrieve order details if needed
    let orderDetails = null;
    if (payment.orderId) {
      try {
        const orderResponse = await squareClient.ordersApi.retrieveOrder(payment.orderId);
        if (orderResponse.result.order) {
          orderDetails = {
            id: orderResponse.result.order.id,
            state: orderResponse.result.order.state,
            createdAt: orderResponse.result.order.createdAt,
          };
        }
      } catch (orderError) {
        console.error('Error retrieving order details:', orderError);
        // Continue without order details
      }
    }
    
    // Format response
    const responseData = {
      paymentId: payment.id,
      orderId: payment.orderId,
      status: payment.status,
      amount: Number(payment.totalMoney?.amount || 0),
      currency: payment.totalMoney?.currency || 'USD',
      receiptUrl: payment.receiptUrl,
      createdAt: payment.createdAt,
      cardDetails: payment.cardDetails ? {
        brand: payment.cardDetails.card?.cardBrand || '',
        last4: payment.cardDetails.card?.last4 || ''
      } : null,
      orderDetails
    };
    
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error retrieving payment details:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve payment details' },
      { status: error.statusCode || 500 }
    );
  }
}
