'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { CartItem } from '@/types/cart';

// Hook to get cart items
export function useCartItems() {
  const { items, itemCount, subtotal } = useContext(CartContext);
  return { items, itemCount, subtotal };
}

// Hook to add items to cart
export function useAddToCart() {
  const { addItem } = useContext(CartContext);
  return addItem;
}

// Hook to remove items from cart
export function useRemoveFromCart() {
  const { removeItem } = useContext(CartContext);
  return removeItem;
}

// Hook to update item quantity
export function useUpdateCartItemQuantity() {
  const { updateQuantity } = useContext(CartContext);
  return updateQuantity;
}

// Hook to clear cart
export function useClearCart() {
  const { clearCart } = useContext(CartContext);
  return clearCart;
}
