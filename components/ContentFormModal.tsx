
import React, { useState, useEffect, useMemo } from 'react';
import { ContentItem, Category } from '../types';
import { XIcon } from './icons/XIcon';

interface ContentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  item?: ContentItem | null;
  categories: Category[];
}

export const ContentFormModal: React.FC<ContentFormModalProps> = ({ isOpen, onClose, onSave, item, categories }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const isEditMode = !!item;

  const availableSubcategories = useMemo(() => {
    if (!category) return [];
    const mainCategory = categories.find(c => c.id === category);
    return mainCategory?.subcategories || [];
  }, [category, categories]);
  
  useEffect(() => {
    if (isOpen && item) {
      setText(item.text);
      setCategory(item.tags[0] || '');
      setSubcategory(item.tags[1] || '');
      setIsFeatured(item.featured || false);
    } else if (isOpen && !item) {
      setText('');
      setCategory('');
      setSubcategory('');
      setIsFeatured(false);
    }
  }, [isOpen, item]);

  useEffect(() => {
      if (!availableSubcategories.find(sc => sc.id === subcategory)) {
          setSubcategory('');
      }
  }, [category, availableSubcategories, subcategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !category) {
      alert('Text and main category are required.');
      return;
    }

    const finalTags = [category];
    if (subcategory) {
        finalTags.push(subcategory);
    }

    const savedItem = {
      ...(item || {}),
      text,
      tags: finalTags,
      featured: isFeatured,
    };
    onSave(savedItem);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg m-4 transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">{isEditMode ? 'Edit Content' : 'Add New Content'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="content-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content Text</label>
            <textarea
              id="content-text"
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              required
              className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="">Select a category...</option>
                {categories.filter(c => !c.premium).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subcategory (Optional)</label>
              <select
                id="subcategory"
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                disabled={availableSubcategories.length === 0}
                className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50"
              >
                <option value="">Select a subcategory...</option>
                {availableSubcategories.map(sc => (
                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                    <input
                        id="featured"
                        aria-describedby="featured-description"
                        name="featured"
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-accent)]"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="featured" className="font-medium text-gray-700 dark:text-gray-300">
                        Feature Content
                    </label>
                    <p id="featured-description" className="text-gray-500 dark:text-gray-400">
                        If checked, this content will appear on the homepage's "Featured Content" section.
                    </p>
                </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold rounded-lg text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
              {isEditMode ? 'Save Changes' : 'Add Content'}
            </button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};
