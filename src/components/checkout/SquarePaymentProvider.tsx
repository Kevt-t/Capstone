'use client';

import { useEffect, useState, ReactNode } from 'react';
import Script from 'next/script';

interface SquarePaymentProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    Square?: any;
  }
}

export default function SquarePaymentProvider({ children }: SquarePaymentProviderProps) {
  const [squareLoaded, setSquareLoaded] = useState(false);
  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '';
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';
  const environment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || 'sandbox';
  
  useEffect(() => {
    // Initialize Square when script is loaded
    if (squareLoaded && window.Square) {
      try {
        const payments = window.Square.payments(applicationId, locationId);
        
        // Store the payments instance in a global context or state management
        // for use by the payment form component
        window.squarePayments = payments;
      } catch (error) {
        console.error('Error initializing Square:', error);
      }
    }
  }, [squareLoaded, applicationId, locationId]);
  
  const handleScriptLoad = () => {
    setSquareLoaded(true);
  };
  
  return (
    <>
      <Script
        src={`https://sandbox.web.squarecdn.com/v1/square.js`}
        onLoad={handleScriptLoad}
      />
      {children}
    </>
  );
}
