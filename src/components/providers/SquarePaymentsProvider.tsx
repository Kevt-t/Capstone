'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Script from 'next/script';

interface SquareContextType {
  squarePayments: any;
  loaded: boolean;
  error: string | null;
}

const SquareContext = createContext<SquareContextType>({
  squarePayments: null,
  loaded: false,
  error: null
});

export const useSquarePayments = () => useContext(SquareContext);

export default function SquarePaymentsProvider({ children }: { children: React.ReactNode }) {
  const [squareConfig, setSquareConfig] = useState<any>(null);
  const [squarePayments, setSquarePayments] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Fetch Square configuration
  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch('/api/square-config');
        if (!response.ok) {
          throw new Error('Failed to load Square configuration');
        }
        const config = await response.json();
        setSquareConfig(config);
        console.log('Square config loaded:', config.environment);
      } catch (err: any) {
        console.error('Error loading Square configuration:', err);
        setError('Failed to initialize payment system');
      }
    }

    fetchConfig();
  }, []);

  // Initialize Square
  useEffect(() => {
    if (!scriptLoaded || !squareConfig) return;

    const initializeSquare = async () => {
      try {
        if (!window.Square) {
          setError('Square SDK not loaded');
          return;
        }

        const payments = window.Square.payments(
          squareConfig.applicationId,
          squareConfig.locationId
        );

        // Make payments available globally for existing components
        window.squarePayments = payments;
        
        setSquarePayments(payments);
        setLoaded(true);
        console.log('Square Payments SDK initialized successfully');
      } catch (err: any) {
        console.error('Error initializing Square Payments:', err);
        setError('Failed to initialize payment system');
      }
    };

    // Short delay to ensure Square script is fully initialized
    const timeoutId = setTimeout(() => {
      initializeSquare();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [scriptLoaded, squareConfig]);

  return (
    <SquareContext.Provider value={{ squarePayments, loaded, error }}>
      {squareConfig && (
        <Script
          id="square-payments-sdk"
          src={squareConfig.environment === 'production' 
            ? 'https://web.squarecdn.com/v1/square.js'
            : 'https://sandbox.web.squarecdn.com/v1/square.js'
          }
          onLoad={() => {
            console.log('Square script loaded');
            setScriptLoaded(true);
          }}
          onError={() => {
            console.error('Failed to load Square script');
            setError('Failed to load payment system');
          }}
        />
      )}
      {children}
    </SquareContext.Provider>
  );
}
