import React from 'react';

interface SubcategoryFilterProps {
  subcategories: { id: string; name: string }[];
  selectedSubcategory: string | null;
  onSelect: (id: string | null) => void;
}

export const SubcategoryFilter: React.FC<SubcategoryFilterProps> = ({ subcategories, selectedSubcategory, onSelect }) => {
  const filters = [{ id: null, name: 'All' }, ...subcategories];

  return (
    <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-8">
      {filters.map((filter) => {
        const isSelected = selectedSubcategory === filter.id;
        return (
          <button
            key={filter.id || 'all'}
            onClick={() => onSelect(filter.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
              isSelected
                ? 'text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
            style={isSelected ? { backgroundColor: 'var(--color-primary)' } : {}}
          >
            {filter.name}
          </button>
        );
      })}
    </div>
  );
};