import React, { useState, useEffect, useRef } from 'react';
import { ContentItem, Category } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { XIcon } from './icons/XIcon';
import { SearchResultItem } from './SearchResultItem';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { useDesign } from '../../contexts/DesignContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ContentItem[];
  categories: Category[];
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, items, categories }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeInitiator = useRef<'user' | 'popstate'>(null);
  const { siteName } = useDesign();

  const debouncedQuery = useDebounce(query, 300);

  const searchCategories = [
    { id: null, name: 'All' }, 
    ...categories
        .filter(c => !c.premium)
        .map(c => ({ id: c.id, name: c.name }))
  ];

  useEffect(() => {
    const handlePopState = () => {
      closeInitiator.current = 'popstate';
      onClose();
    };
    
    if (isOpen) {
      closeInitiator.current = 'user';
      window.history.pushState({ searchOpen: true }, '');
      window.addEventListener('popstate', handlePopState);
      
      inputRef.current?.focus();
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);

      if (isOpen && closeInitiator.current === 'user' && window.history.state?.searchOpen) {
          window.history.back();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSearchResults([]);
      setSelectedCategory(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const categoryFilteredItems = selectedCategory
      ? items.filter(item => item.tags.includes(selectedCategory))
      : items;
      
    if (debouncedQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const lowercasedQuery = debouncedQuery.toLowerCase();
    const filtered = categoryFilteredItems.filter(item => 
      item.text.toLowerCase().includes(lowercasedQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );
    setSearchResults(filtered);
  }, [debouncedQuery, items, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-gray-900 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <button 
          onClick={onClose} 
          aria-label="Close search" 
          className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="relative flex-grow flex items-center">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${siteName}`}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-full py-2.5 pl-10 pr-11"
          />
          {query && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button 
                onClick={() => setQuery('')} 
                aria-label="Clear search" 
                className="p-2 rounded-full text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex overflow-x-auto gap-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {searchCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id || 'all'}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] whitespace-nowrap ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                }`}
                style={isSelected ? { backgroundColor: 'var(--color-primary)' } : {}}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>


      <div className="overflow-y-auto flex-grow">
        <div className="max-w-3xl mx-auto p-4">
            {debouncedQuery && searchResults.length > 0 && (
              <div className="pb-2 text-sm text-gray-500 dark:text-gray-400">
                Found {searchResults.length} result{searchResults.length > 1 ? 's' : ''}.
              </div>
            )}
            <div className="space-y-2">
              {searchResults.map(item => (
                <SearchResultItem key={item.id} item={item} query={debouncedQuery} categories={categories} />
              ))}
            </div>
            {debouncedQuery && searchResults.length === 0 && (
              <div className="text-center py-10 px-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No results found for "{debouncedQuery}"</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Try a different search term.</p>
              </div>
            )}
            {!debouncedQuery && (
              <div className="text-center py-10 px-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Search for content</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Find bios, quotes, and more across all categories.</p>
              </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default SearchModal;