import React from 'react';
import { Category } from '../types';
import { iconMap } from './iconMap';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { PremiumIcon } from './icons/PremiumIcon';

interface AdminCategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const iconColors: { [key: string]: string } = {
    bio: 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400',
    shayari: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    'love-quotes': 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
    'fun-facts': 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    captions: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
    premium: 'bg-gray-800 text-yellow-400 dark:bg-gray-700 dark:text-yellow-300',
    default: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
};

export const AdminCategoryCard: React.FC<AdminCategoryCardProps> = ({ category, onEdit, onDelete }) => {
    const IconComponent = iconMap[category.Icon as string];
    const colorClass = iconColors[category.id] || iconColors.default;

    return (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                {/* Main content area (Icon + Text) */}
                <div className="flex-grow flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        {IconComponent && <IconComponent className="w-7 h-7" />}
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.name}</h3>
                            {category.premium && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                                    <PremiumIcon className="w-3 h-3" />
                                    Premium
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category.subtitle}</p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>{category.subcategories?.length || 0} Subcategories</span>
                            <span className="mx-2">|</span>
                            <span>ID: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{category.id}</code></span>
                        </div>
                    </div>
                </div>

                {/* Actions area */}
                <div className="flex gap-2 sm:flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                    <button 
                        onClick={() => onEdit(category)}
                        className="flex items-center justify-center gap-2 flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <EditIcon className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                    <button 
                        onClick={() => onDelete(category)}
                        className="flex items-center justify-center gap-2 flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/80 transition-colors"
                    >
                        <DeleteIcon className="w-4 h-4" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
