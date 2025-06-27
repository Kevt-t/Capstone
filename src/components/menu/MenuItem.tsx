'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useAddToCart } from '@/hooks/useCart';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const addToCart = useAddToCart();
  
  // Get the selected variation - ensure we have a valid variation to work with
  const hasVariations = item.variations && item.variations.length > 0;
  const selectedVariation = hasVariations ? item.variations[selectedVariationIndex] : null;
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (selectedVariation) {
      addToCart({
        id: selectedVariation.id,
        name: item.name,
        variationName: selectedVariation.name,
        // Convert BigInt to Number when adding to cart
        price: Number(selectedVariation.price_money.amount),
        image: item.image_url,
        quantity: 1,
      });
      console.log('Added to cart:', item.name, selectedVariation.name);
    }
  };
  
  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* Item image */}
      <div className="relative w-full h-48 mb-4 rounded overflow-hidden bg-gray-200">
        {item.image_url && !imgError ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        
        {item.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
        )}
        
        {/* Item variations */}
        {item.variations && item.variations.length > 0 ? (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {item.variations.map((variation, index) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariationIndex(index)}
                  className={`px-3 py-1 text-sm rounded border ${
                    selectedVariationIndex === index
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {variation.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold">
            ${selectedVariation ? (Number(selectedVariation.price_money.amount) / 100).toFixed(2) : '0.00'}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariation}
            className="btn-primary flex items-center gap-2 active:scale-95 transition-transform"
            aria-label="Add to cart"
            type="button"
          >
            <FaPlus size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
