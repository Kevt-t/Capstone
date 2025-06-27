import Link from 'next/link';
import CartDisplay from '@/components/cart/CartDisplay';
import { Suspense } from 'react';

export default function CartPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Your Order</h1>
      
      <Suspense fallback={<div>Loading cart...</div>}>
        <CartDisplay />
      </Suspense>
            
      <div className="mt-8 flex justify-between">
        <Link href="/menu" className="btn-secondary">
          Continue Shopping
        </Link>
        <Link href="/checkout" className="btn-primary">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
