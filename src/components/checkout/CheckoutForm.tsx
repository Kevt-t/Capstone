'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCartItems, useClearCart } from '@/hooks/useCart';
import PhoneInput from './PhoneInput';
import { formatPhoneForSquare } from '@/utils/phoneFormatting';
import { useSquarePayments } from '../providers/SquarePaymentsProvider';

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal } = useCartItems();
  const clearCart = useClearCart();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardPaymentReady, setCardPaymentReady] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupNotes: '',
    pickupType: 'ASAP', // Default to ASAP pickup
    pickupTime: '', // Will be used for scheduled pickups
  });
  
  const [phoneValid, setPhoneValid] = useState(false);
  
  // Calculate the minimum allowed pickup time (30 minutes from now)
  const getMinPickupTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Add 30 minutes
    
    // Format as YYYY-MM-DDThh:mm
    return new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 16);
  };
  
  const minPickupTime = getMinPickupTime();
  
  // Square payment form references
  const cardPaymentElement = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null); // Store card instance for cleanup
  const cardInitializedRef = useRef(false); // Track if card is already initialized
  
  // Use Square context
  const { squarePayments, loaded: squareLoaded, error: squareError } = useSquarePayments();
  
  // Initialize Square Payment form with cleanup
  useEffect(() => {
    async function initializeCard() {
      if (!squareLoaded || !squarePayments || cardPaymentElement.current === null || cardInitializedRef.current) {
        return; // Skip if already initialized or missing dependencies
      }
      
      try {
        // Mark as initializing to prevent duplicate initialization
        cardInitializedRef.current = true;
        console.log('Initializing Square Card payment form...');
        
        const card = await squarePayments.card({
          // Square card element options
          style: {
            '.input-container': {
              borderColor: '#E0E0E0',
              borderRadius: '4px'
            }
          }
        });
        
        // Store the card instance for cleanup
        cardInstanceRef.current = card;
        
        // Attach the card to the DOM
        await card.attach(cardPaymentElement.current);
        setCardPaymentReady(true);
        console.log('Square Card payment form initialized successfully');
      } catch (e) {
        console.error('Error initializing Square Card:', e);
        setError('Failed to load payment form. Please refresh and try again.');
        cardInitializedRef.current = false; // Reset flag if initialization failed
      }
    }

    if (squareLoaded && squarePayments) {
      initializeCard();
    }
    
    // Cleanup function to destroy card instance when component unmounts
    return () => {
      if (cardInstanceRef.current) {
        try {
          console.log('Cleaning up Square Card payment form');
          cardInstanceRef.current.destroy();
        } catch (e) {
          console.error('Error cleaning up Square Card:', e);
        }
        cardInstanceRef.current = null;
        cardInitializedRef.current = false;
      }
    };
  }, [squareLoaded, squarePayments]);
  
  // Display Square provider errors
  useEffect(() => {
    if (squareError) {
      setError(`Payment system error: ${squareError}`);
    }
  }, [squareError]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (isLoading || paymentInProgress || items.length === 0 || !cardPaymentReady || !phoneValid) {
      if (!phoneValid) {
        setError('Please enter a valid phone number');
      }
      return;
    }
    
    // Validate that scheduled pickup has a time selected
    if (formData.pickupType === 'SCHEDULED' && !formData.pickupTime) {
      setError('Please select a pickup time');
      return;
    }
    
    setIsLoading(true);
    setPaymentInProgress(true);
    setError(null);
    
    // Format phone for Square API (E.164 format)
    const formattedPhone = formatPhoneForSquare(formData.phone);
    
    try {
      // Step 1: First, tokenize the card payment using Square Web Payments SDK
      if (!squarePayments) {
        throw new Error('Square payments not initialized');
      }
      
      console.log('Beginning payment tokenization...');
      
      // Verify the card instance exists
      if (!cardInstanceRef.current) {
        throw new Error('Card payment form not properly initialized');
      }
      
      // Use the existing card instance that's already attached to the DOM to tokenize
      const paymentResults = await cardInstanceRef.current.tokenize();
      
      console.log('Tokenization result status:', paymentResults.status);
      
      if (paymentResults.status !== 'OK') {
        console.error('Tokenization failed:', paymentResults.errors);
        throw new Error(
          paymentResults.errors && paymentResults.errors.length > 0
            ? paymentResults.errors[0].message
            : 'Payment tokenization failed'
        );
      }
      
      // Step 2: Send order details and payment token to combined API endpoint
      // that will create order and process payment in one step
      console.log('Sending order and payment details to backend...');
      
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Order details
          orderDetails: {
            items,
            customer: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formattedPhone, // Use E.164 formatted phone
            },
            pickup: {
              type: formData.pickupType,
              ...(formData.pickupType === 'SCHEDULED' && {
                time: new Date(formData.pickupTime).toISOString()
              })
            },
            pickupNotes: formData.pickupNotes,
          },
          // Payment details
          paymentDetails: {
            sourceId: paymentResults.token,
            amount: subtotal,
          }
        }),
      });
      
      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.error || 'Checkout process failed');
      }
      
      // Get payment confirmation
      const checkoutResult = await checkoutResponse.json();
      
      // Success - clear cart and redirect to confirmation page
      clearCart();
      router.push(`/order-confirmation?id=${checkoutResult.paymentId}`);
      
    } catch (err: any) {
      console.error('Checkout error:', err);
      
      // Detailed logging for debugging
      if (err?.errors) {
        console.error('API errors:', JSON.stringify(err.errors, null, 2));
      }
      
      let errorMessage = 'An error occurred during checkout';
      
      // Better error messages for users
      if (err.message?.includes('card')) {
        errorMessage = 'There was an issue with your card. Please check your payment details and try again.';
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setPaymentInProgress(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Checkout Information</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <PhoneInput
              value={formData.phone}
              onChange={(value, isValid) => {
                setFormData(prev => ({ ...prev, phone: value }));
                setPhoneValid(isValid);
              }}
              required
              className="input-field"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Pickup Time</h3>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="asap"
                name="pickupType"
                value="ASAP"
                checked={formData.pickupType === 'ASAP'}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor="asap" className="ml-2 block text-sm font-medium text-gray-700">
                As soon as possible
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="scheduled"
                name="pickupType"
                value="SCHEDULED"
                checked={formData.pickupType === 'SCHEDULED'}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor="scheduled" className="ml-2 block text-sm font-medium text-gray-700">
                Schedule for later
              </label>
            </div>
            
            {formData.pickupType === 'SCHEDULED' && (
              <div className="pl-6 pt-2">
                <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Time *
                </label>
                <input
                  type="datetime-local"
                  id="pickupTime"
                  name="pickupTime"
                  value={formData.pickupTime}
                  min={minPickupTime}
                  onChange={handleInputChange}
                  required={formData.pickupType === 'SCHEDULED'}
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please select a time at least 30 minutes from now
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="pickupNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Notes (optional)
          </label>
          <textarea
            id="pickupNotes"
            name="pickupNotes"
            value={formData.pickupNotes}
            onChange={handleInputChange}
            rows={3}
            className="input-field"
            placeholder="Special instructions for pickup..."
          />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Payment Information</h3>
          <div id="card-container" ref={cardPaymentElement} className="border border-gray-300 p-4 rounded-md min-h-[100px]">
            {!squareLoaded && <p className="text-gray-500">Loading payment system...</p>}
            {squareLoaded && !cardPaymentReady && <p className="text-gray-500">Initializing payment form...</p>}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !cardPaymentReady || items.length === 0 || !phoneValid}
          className={`btn-primary w-full py-3 ${
            (isLoading || !cardPaymentReady || items.length === 0 || !phoneValid) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : `Pay ${(subtotal / 100).toFixed(2)} USD`}
        </button>
      </form>
    </div>
  );
}
