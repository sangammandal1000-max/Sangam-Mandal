import React, { useState, useEffect, useCallback } from 'react';
import { Category } from '../types';
import { XIcon } from './icons/XIcon';
import { iconNames } from './iconMap';
import { ToggleSwitch } from './ToggleSwitch';
import { TrashIcon } from './icons/TrashIcon';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  category?: Category | null;
}

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [icon, setIcon] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const isEditMode = !!category;

  useEffect(() => {
    if (isOpen && category) {
      setName(category.name);
      setSubtitle(category.subtitle);
      setIcon(category.Icon as string);
      setIsPremium(category.premium || false);
      setSubcategories(category.subcategories || []);
    } else if (isOpen && !category) {
      setName('');
      setSubtitle('');
      setIcon('');
      setIsPremium(false);
      setSubcategories([]);
    }
  }, [isOpen, category]);

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim()) {
      const newSub = {
        name: newSubcategoryName.trim(),
        id: slugify(newSubcategoryName.trim()),
      };
      if (!subcategories.some(sc => sc.id === newSub.id)) {
        setSubcategories(prev => [...prev, newSub]);
        setNewSubcategoryName('');
      } else {
        alert('Subcategory with this name already exists.');
      }
    }
  };

  const handleRemoveSubcategory = (idToRemove: string) => {
    setSubcategories(prev => prev.filter(sc => sc.id !== idToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subtitle || !icon) {
      alert('Name, Subtitle, and Icon are required.');
      return;
    }

    onSave({
      name,
      subtitle,
      Icon: icon,
      premium: isPremium,
      subcategories,
      count: category?.count || 0, // Preserve count on edit, default for new
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg m-4 transform transition-all animate-fade-in-up max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold">{isEditMode ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" id="cat-name" value={name} onChange={e => setName(e.target.value)} required className="input-style" />
            </div>
            <div>
              <label htmlFor="cat-icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
              <select id="cat-icon" value={icon} onChange={e => setIcon(e.target.value)} required className="input-style">
                <option value="">Select Icon...</option>
                {iconNames.map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="cat-subtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
            <input type="text" id="cat-subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} required className="input-style" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subcategories</label>
            <div className="space-y-2">
              {subcategories.map(sc => (
                <div key={sc.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                  <span className="text-sm">{sc.name}</span>
                  <button type="button" onClick={() => handleRemoveSubcategory(sc.id)} className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input type="text" value={newSubcategoryName} onChange={e => setNewSubcategoryName(e.target.value)} placeholder="New subcategory name" className="input-style flex-grow" />
              <button type="button" onClick={handleAddSubcategory} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Add</button>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
                <div className="text-sm">
                    <label htmlFor="premium" className="font-medium text-gray-700 dark:text-gray-300">
                        Premium Category
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                        Premium categories require a subscription to view.
                    </p>
                </div>
                <ToggleSwitch checked={isPremium} onChange={setIsPremium} />
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold rounded-lg text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
              {isEditMode ? 'Save Changes' : 'Add Category'}
            </button>
        </div>
        <style>{`.input-style { display: block; width: 100%; background-color: #F9FAFB; border-color: #D1D5DB; border-width: 1px; border-radius: 0.375rem; padding: 0.5rem 0.75rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); } .dark .input-style { background-color: #374151; border-color: #4B5563; color: #D1D5DB; } .input-style:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: var(--color-accent); box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: var(--color-accent); }`}</style>
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
