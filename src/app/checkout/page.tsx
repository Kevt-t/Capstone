import { Suspense } from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import SquarePaymentProvider from '@/components/checkout/SquarePaymentProvider';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SquarePaymentProvider>
            <Suspense fallback={<div>Loading checkout form...</div>}>
              <CheckoutForm />
            </Suspense>
          </SquarePaymentProvider>
        </div>
        
        <div className="lg:col-span-1">
          <Suspense fallback={<div>Loading order summary...</div>}>
            <OrderSummary />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
