import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Category, ContentItem } from '../types';
import { CardGrid } from './CardGrid';
import { Header } from './Header';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SubcategoryFilter } from './SubcategoryFilter';
// FIX: Changed named import for Footer to a default import to match its export type.
import Footer from './Footer';
import { iconMap } from './iconMap';

interface CategoryPageProps {
  category: Category;
  onBack: () => void;
  onSearchClick: () => void;
  onMenuClick: () => void;
  contentItems: ContentItem[];
  categories: Category[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onBack, onSearchClick, onMenuClick, contentItems, categories: allCategories }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSubcategory(null);
  }, [category.id]);

  const items = useMemo(() => {
    return contentItems.filter(item => {
      const isInCategory = item.tags.includes(category.id);
      if (!isInCategory) return false;

      if (selectedSubcategory) {
        return item.tags.includes(selectedSubcategory);
      }
      
      return true;
    });
  }, [category.id, selectedSubcategory, contentItems]);

  const iconColors = {
    bio: 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400',
    shayari: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    'love-quotes': 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
    'fun-facts': 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    captions: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
    premium: 'bg-gray-800 text-yellow-400 dark:bg-gray-700 dark:text-yellow-300',
  };

  const touchStartX = useRef(0);
  const touchMoveX = useRef(0);
  const SWIPE_THRESHOLD = 75;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchMoveX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchMoveX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === 0 || touchMoveX.current === 0) return;

    const swipeDistance = touchMoveX.current - touchStartX.current;

    if (swipeDistance > SWIPE_THRESHOLD) {
      onBack();
    }

    touchStartX.current = 0;
    touchMoveX.current = 0;
  };
  
  const IconComponent = iconMap[category.Icon as unknown as string];

  return (
    <div
      className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Header onSearchClick={onSearchClick} onMenuClick={onMenuClick} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] font-semibold transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Categories</span>
          </button>
        </div>

        <div className="relative mb-6 rounded-2xl p-[2px] overflow-hidden shadow-lg">
          <div
            className="absolute inset-0 z-0 animate-[rotate-border_4s_linear_infinite]"
            style={{
              background: `conic-gradient(from 180deg at 50% 50%, #a855f7, #ec4899, #f59e0b, #a855f7)`,
            }}
          />
          <header className="relative z-10 flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-[14px]">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${iconColors[category.id] || 'bg-gray-100 dark:bg-gray-700'}`}>
              {IconComponent && <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">{category.subtitle}</p>
            </div>
          </header>
        </div>
        
        <div className="min-h-[65vh]">
          {category.subcategories && category.subcategories.length > 0 && (
            <SubcategoryFilter 
              subcategories={category.subcategories}
              selectedSubcategory={selectedSubcategory}
              onSelect={setSelectedSubcategory}
            />
          )}

          <CardGrid items={items} categories={allCategories} displaySubcategory={true} />
        </div>
      </main>
      <Footer categories={allCategories} />
    </div>
  );
};

export default CategoryPage;
