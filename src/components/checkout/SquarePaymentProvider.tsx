'use client';

// This file is kept for compatibility but now just forwards to the main provider
// to avoid duplicate Square initialization

import { ReactNode } from 'react';
import { useSquarePayments } from '../providers/SquarePaymentsProvider';

interface SquarePaymentProviderProps {
  children: ReactNode;
}

// This is a compatibility wrapper that just passes through to our global provider
export default function SquarePaymentProvider({ children }: SquarePaymentProviderProps) {
  // Access the global Square payments provider
  useSquarePayments();
  
  // Just render children with no additional initialization
  return <>{children}</>;
}
