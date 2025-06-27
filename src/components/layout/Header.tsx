'use client';

import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useCartItems } from '@/hooks/useCart';

export default function Header() {
  const { itemCount } = useCartItems();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold text-primary">
              Restaurant Name
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary">
              Home
            </Link>
            <Link href="/menu" className="text-gray-600 hover:text-primary">
              Menu
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/cart" 
              className="flex items-center text-gray-600 hover:text-primary"
              aria-label="Shopping cart"
            >
              <FaShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
