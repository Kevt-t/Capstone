'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaInstagram } from 'react-icons/fa';
import { useCartItems } from '@/hooks/useCart';

export default function Header() {
  const { itemCount } = useCartItems();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/El Molino Logo.webp" 
                alt="El Molino Tortilleria & Restaurant" 
                width={180} 
                height={90} 
                className="object-contain"
                priority
              />
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">  
            <Link href="/menu" className="text-gray-600 hover:text-primary flex items-center">
              <span>Menu</span>
            </Link>
            <Link 
              href="https://www.instagram.com/elmolinophilly/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-[#E1306C] transition-colors"
              aria-label="Visit our Instagram"
            >
              <FaInstagram size={24} />
              <span className="ml-2 hidden lg:inline">Instagram</span>
            </Link>
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
