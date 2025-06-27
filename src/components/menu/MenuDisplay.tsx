'use client';

import { useState } from 'react';
import MenuItem from './MenuItem';
import { MenuData, MenuItem as MenuItemType } from '@/types/menu';

interface MenuDisplayProps {
  menuData: MenuData;
  activeCategory?: string | null;
}

export default function MenuDisplay({ menuData, activeCategory = null }: MenuDisplayProps) {
  
  // Group items by category
  const categorizedItems = menuData.items.reduce<Record<string, MenuItemType[]>>((acc, item) => {
    const category = item.category_name || 'Uncategorized';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(item);
    return acc;
  }, {});
  
  // Get all categories
  const categories = Object.keys(categorizedItems);
  
  // Filter items by active category or show all if no category is selected
  const displayItems = activeCategory 
    ? categorizedItems[activeCategory] 
    : menuData.items;
  
  return (
    <div>
      
      {/* Menu items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map(item => (
          <MenuItem 
            key={item.id} 
            item={item} 
          />
        ))}
      </div>
      
      {displayItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No menu items found.</p>
        </div>
      )}
    </div>
  );
}
