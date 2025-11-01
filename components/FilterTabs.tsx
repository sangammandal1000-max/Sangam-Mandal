import React from 'react';

interface FilterTabsProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

const FILTERS = ['All', 'Trending', 'Recent', 'Popular'];

export const FilterTabs: React.FC<FilterTabsProps> = ({ selectedFilter, onSelectFilter }) => {
  return (
    <div className="flex justify-center overflow-x-auto gap-3 sm:gap-4 mb-8 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map((filter) => {
        const isSelected = selectedFilter === filter;
        return (
          <button
            key={filter}
            onClick={() => onSelectFilter(filter)}
            className={`px-4 sm:px-5 py-2.5 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] whitespace-nowrap ${
              isSelected
                ? 'text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
            style={isSelected ? { backgroundColor: 'var(--color-primary)' } : {}}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
};