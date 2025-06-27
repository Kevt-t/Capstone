'use client';

import { useCartItems } from '@/hooks/useCart';

export default function OrderSummary() {
  const { items, subtotal } = useCartItems();
  
  // Calculate tax (assume 8.5%)
  const taxRate = 0.085;
  const taxAmount = Math.round(subtotal * taxRate);
  
  // Service fee
  const serviceFee = 100; // $1.00
  
  // Calculate total
  const total = subtotal + taxAmount + serviceFee;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div>
              <span className="font-medium">{item.quantity}x </span>
              <span>{item.name}</span>
              {item.variationName && (
                <span className="block text-sm text-gray-500">
                  {item.variationName}
                </span>
              )}
            </div>
            <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-2">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${(subtotal / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>${(taxAmount / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Service Fee</span>
          <span>${(serviceFee / 100).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${(total / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
