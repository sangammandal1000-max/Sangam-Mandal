import React from 'react';
import { ContentItem, Category } from '../types';
import { EyeIcon } from './icons/EyeIcon';
import { HeartIcon } from './icons/HeartIcon';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { StarIcon } from './icons/StarIcon';
import { ShareIcon } from './icons/ShareIcon';

interface AdminContentCardProps {
  item: ContentItem;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  isMobileOptimized?: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  categories: Category[];
}

const categoryColors = {
    bio: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-400',
    shayari: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400',
    'love-quotes': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    'fun-facts': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
    captions: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400',
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export const AdminContentCard: React.FC<AdminContentCardProps> = ({ item, onEdit, onDelete, isMobileOptimized, isSelected, onSelect, categories }) => {
  const safeTags = Array.isArray(item.tags) ? item.tags : [];
  const mainCategory = categories.find(c => c.id === safeTags[0]);

  return (
    <div className={`border rounded-lg p-4 flex gap-4 items-start transition-colors duration-200 ${
        isSelected
            ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600'
            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
    }`}>
        <div className="flex-shrink-0 pt-1">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(item.id as string)}
                className="h-5 w-5 rounded border-gray-300 dark:border-gray-500 text-[var(--color-primary)] focus:ring-[var(--color-accent)] cursor-pointer"
                aria-label={`Select content item ${item.id}`}
            />
        </div>
        
        <div className={`flex-grow flex gap-4 ${
            isMobileOptimized
                ? 'flex-col'
                : 'flex-col sm:flex-row sm:items-center'
        }`}>
            <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                {item.featured && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                    <StarIcon className="w-3.5 h-3.5" />
                    Featured
                    </span>
                )}
                {safeTags.map(tag => {
                    const tagCategory = categories.find(c => c.id === tag) || mainCategory?.subcategories?.find(sc => sc.id === tag);
                    const colorClass = tag in categoryColors ? categoryColors[tag as keyof typeof categoryColors] : categoryColors.default;
                    return (
                    <span key={tag} className={`capitalize text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
                        {tagCategory?.name || tag}
                    </span>
                    );
                })}
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{item.text}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                    <EyeIcon className="w-4 h-4" />
                    <span>{item.views}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <HeartIcon className="w-4 h-4" />
                    <span>{item.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <ShareIcon className="w-4 h-4" />
                    <span>{item.shares || 0}</span>
                </div>
                </div>
            </div>
            <div className={`flex gap-2 ${
                isMobileOptimized
                ? 'w-full self-start'
                : 'flex-shrink-0 sm:flex-col self-start sm:self-center w-full sm:w-auto'
            }`}>
                <button 
                onClick={() => onEdit(item)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                <EditIcon className="w-4 h-4" />
                <span>Edit</span>
                </button>
                <button 
                onClick={() => onDelete(item)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/80 transition-colors"
                >
                <DeleteIcon className="w-4 h-4" />
                <span>Delete</span>
                </button>
            </div>
        </div>
    </div>
  );
};