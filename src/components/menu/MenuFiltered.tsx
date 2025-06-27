'use client';

import { useState } from 'react';
import { MenuData } from '@/types/menu';
import CategoryFilter from './CategoryFilter';
import MenuDisplay from './MenuDisplay';

interface MenuFilteredProps {
  menuData: MenuData;
}

export default function MenuFiltered({ menuData }: MenuFilteredProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Group items by category for display
  const categories = [...new Set(menuData.items
    .filter(item => item.category_name)
    .map(item => item.category_name))] as string[];

  // Handle category change
  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
      
      {/* Category filter component */}
      <CategoryFilter 
        categories={categories} 
        onCategoryChange={handleCategoryChange} 
      />
      
      {/* Menu display component */}
      <div className="mt-6">
        <MenuDisplay 
          menuData={menuData} 
          activeCategory={activeCategory} 
        />
      </div>
    </>
  );
}
