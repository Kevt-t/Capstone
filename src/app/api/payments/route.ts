import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment } from 'square';
import { randomUUID } from 'crypto';

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
    console.log('Payment request received');
    const requestBody = await request.json();
    const { orderId, sourceId, customerDetails } = requestBody;
    
    console.log('Payment request data:', {
      orderId,
      sourceIdProvided: !!sourceId,
      customerProvided: !!customerDetails
    });
    
    if (!orderId) {
      console.error('Payment request missing order ID');
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    if (!sourceId) {
      console.error('Payment request missing source ID');
      return NextResponse.json(
        { error: 'Payment source ID is required' },
        { status: 400 }
      );
    }
    
    const squareClient = initSquareClient();
    const locationId = process.env.SQUARE_LOCATION_ID;
    
    if (!locationId) {
      console.error('Square location ID not configured');
      return NextResponse.json(
        { error: 'Square location ID not configured' },
        { status: 500 }
      );
    }
    
    // First, retrieve the order to get the current amount
    console.log(`Retrieving order details for order ID: ${orderId}`);
    const orderResult = await squareClient.ordersApi.retrieveOrder(orderId);
    
    if (!orderResult.result.order) {
      console.error(`Order ${orderId} not found in Square`);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    console.log(`Successfully retrieved order ${orderId}`);
    
    const order = orderResult.result.order;
    const totalMoney = order.netAmountDueMoney || order.totalMoney;
    
    if (!totalMoney) {
      return NextResponse.json(
        { error: 'Invalid order amount' },
        { status: 400 }
      );
    }
    
    // Create unique idempotency key for this payment - using UUID for better uniqueness
    const idempotencyKey = `payment_${randomUUID()}`;
    console.log(`Processing payment for order ${orderId} with idempotency key ${idempotencyKey}`);
    
    // Log order details before payment
    console.log('Order details:', {
      id: order.id,
      state: order.state,
      totalAmount: Number(totalMoney.amount),
      currency: totalMoney.currency
    });
    
    // Create payment request object
    const paymentRequest = {
      sourceId,
      idempotencyKey,
      amountMoney: totalMoney,
      orderId,
      // Add customer to payment if we have details
      buyerEmailAddress: customerDetails?.email,
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
    
    // Update order status to show it's been paid
    console.log(`Updating order ${orderId} status to COMPLETED...`);
    try {
      // First, get the latest order version
      console.log(`Retrieving latest order version for ${orderId}...`);
      const latestOrderResult = await squareClient.ordersApi.retrieveOrder(orderId);
      
      if (!latestOrderResult.result.order) {
        throw new Error('Failed to retrieve latest order version');
      }
      
      const latestVersion = latestOrderResult.result.order.version;
      console.log(`Current order version: ${latestVersion} (was ${order.version})`);
      
      // Now update with the latest version
      const updateResponse = await squareClient.ordersApi.updateOrder(orderId, {
        order: {
          locationId: latestOrderResult.result.order.locationId,
          state: 'COMPLETED',
          version: latestVersion,
        },
        idempotencyKey: `order_update_${idempotencyKey}`,
      });
      
      console.log('Order update response:', {
        success: !!updateResponse.result.order,
        orderId: updateResponse.result.order?.id,
        newState: updateResponse.result.order?.state,
        newVersion: updateResponse.result.order?.version ? 
          Number(updateResponse.result.order.version) : null
      });
    } catch (updateError) {
      // Log error but continue - payment was successful even if order status update fails
      console.error('Warning: Order status update failed:', updateError);
      console.log('Continuing as payment was successful');
    }
    
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
    console.error('Error processing payment:', error);
    
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
      { error: error.message || 'Failed to process payment' },
      { status: error.statusCode || 500 }
    );
  }
}
