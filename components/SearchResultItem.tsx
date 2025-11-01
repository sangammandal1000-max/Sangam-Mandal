
import React, { useState, useCallback } from 'react';
import { ContentItem, Category } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { iconMap } from './iconMap';

interface SearchResultItemProps {
  item: ContentItem;
  query: string;
  categories: Category[];
}

const Highlight: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-purple-200 dark:bg-purple-800 rounded px-0.5 text-gray-800 dark:text-gray-200">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, query, categories }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(item.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [item.text]);
  
  const category = categories.find(c => c.id === item.tags[0]);
  const IconComponent = category ? iconMap[category.Icon as unknown as string] : null;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-start gap-4 border border-gray-100 dark:border-gray-700/50">
      {IconComponent && (
          <div className="flex-shrink-0 text-gray-400 dark:text-gray-500 mt-1">
              <IconComponent className="w-5 h-5" />
          </div>
      )}
      <div className="flex-grow">
        <p className="text-gray-700 dark:text-gray-300">
          <Highlight text={item.text} highlight={query} />
        </p>
      </div>
      <button
        onClick={handleCopy}
        aria-label="Copy content"
        className={`flex-shrink-0 p-2 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
      >
        {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};