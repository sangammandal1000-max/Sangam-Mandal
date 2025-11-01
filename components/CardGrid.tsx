import React from 'react';
import { ContentItem, Category } from '../types';
import { ContentCard } from './ContentCard';

interface CardGridProps {
  items: ContentItem[];
  categories: Category[];
  displaySubcategory?: boolean;
}

export const CardGrid: React.FC<CardGridProps> = ({ items, categories, displaySubcategory }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 min-h-[40vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300">No content found.</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different filter or check back later!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ContentCard key={item.id} item={item} categories={categories} displaySubcategory={displaySubcategory} />
      ))}
    </div>
  );
};
