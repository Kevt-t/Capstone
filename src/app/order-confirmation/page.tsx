'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheck, FaReceipt } from 'react-icons/fa';

interface OrderDetails {
  orderId: string;
  receiptUrl?: string;
  status: string;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const paymentId = searchParams.get('id');
  
  useEffect(() => {
    async function fetchOrderDetails() {
      if (!paymentId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }
      
      try {
        // In a real application, you would fetch the order details from your API
        // For demo purposes, we'll simulate this with a timeout
        setTimeout(() => {
          setOrderDetails({
            orderId: `ORDER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            receiptUrl: 'https://squareup.com/receipt/preview',
            status: 'COMPLETED',
            createdAt: new Date().toISOString(),
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load order details');
        setLoading(false);
      }
    }
    
    fetchOrderDetails();
  }, [paymentId]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }
  
  if (error || !orderDetails) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-700 mb-6">{error || 'Unable to load order details'}</p>
        <Link href="/" className="btn-primary block text-center">
          Return to Homepage
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-2xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-50 p-6 flex flex-col items-center">
          <div className="bg-green-100 rounded-full p-3 mb-4">
            <FaCheck size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
          <p className="text-center text-gray-600">
            Thank you for your order. We've received your payment and are preparing your food.
          </p>
        </div>
        
        <div className="p-6 border-t border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">
                {orderDetails.status === 'COMPLETED' ? 'Confirmed' : orderDetails.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">
                {new Date(orderDetails.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-3">Pickup Instructions</h3>
            <p className="text-gray-600">
              Your order will be ready for pickup in approximately 15-20 minutes. Please go to the pickup counter
              and provide your order number when you arrive.
            </p>
          </div>
          
          {orderDetails.receiptUrl && (
            <div className="mt-6">
              <a 
                href={orderDetails.receiptUrl}
                target="_blank"
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2 text-primary hover:text-primary-dark"
              >
                <FaReceipt />
                View Receipt
              </a>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <Link href="/menu" className="btn-primary w-full block text-center">
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
}
