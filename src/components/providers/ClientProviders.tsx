'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import SquarePaymentsProvider from './SquarePaymentsProvider';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CartProvider>
      <SquarePaymentsProvider>
        {children}
      </SquarePaymentsProvider>
    </CartProvider>
  );
}
