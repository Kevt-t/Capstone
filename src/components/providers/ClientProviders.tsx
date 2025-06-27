'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import SquarePaymentsProvider from './SquarePaymentsProvider';
import { ChatProvider } from './ChatProvider';

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CartProvider>
      <SquarePaymentsProvider>
        <ChatProvider>
          {children}
        </ChatProvider>
      </SquarePaymentsProvider>
    </CartProvider>
  );
}
