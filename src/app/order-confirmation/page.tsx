'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheck, FaReceipt } from 'react-icons/fa';

interface PaymentDetails {
  paymentId: string;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  receiptUrl?: string;
  createdAt: string;
  cardDetails?: {
    brand: string;
    last4: string;
  };
  orderDetails?: {
    id: string;
    state: string;
    createdAt: string;
  };
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const paymentId = searchParams.get('id');
  
  useEffect(() => {
    async function fetchPaymentDetails() {
      if (!paymentId) {
        setError('No payment ID provided');
        setLoading(false);
        return;
      }
      
      try {
        // Fetch payment details from our API
        const response = await fetch(`/api/payment-details?id=${paymentId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch payment details: ${response.status}`);
        }
        
        const data = await response.json();
        setPaymentDetails(data);
        console.log('Payment details loaded:', data);
      } catch (err: any) {
        console.error('Error fetching payment details:', err);
        setError(err.message || 'Failed to load payment details');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPaymentDetails();
  }, [paymentId]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }
  
  if (error || !paymentDetails) {
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
          <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{paymentDetails.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-medium">{paymentDetails.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">
                {paymentDetails.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">
                {(paymentDetails.amount / 100).toFixed(2)} {paymentDetails.currency}
              </span>
            </div>
            {paymentDetails.cardDetails && (
              <div className="flex justify-between">
                <span className="text-gray-600">Card:</span>
                <span className="font-medium">
                  {paymentDetails.cardDetails.brand} •••• {paymentDetails.cardDetails.last4}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">
                {new Date(paymentDetails.createdAt).toLocaleString()}
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
          
          {paymentDetails.receiptUrl && (
            <div className="mt-6">
              <a
                href={paymentDetails.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-2 px-4 rounded mt-6 hover:bg-gray-200 transition-colors"
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
