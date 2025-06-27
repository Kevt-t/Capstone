'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
