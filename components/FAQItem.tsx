
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left focus:outline-none"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{question}</h3>
        <ChevronDownIcon
          className={`w-6 h-6 text-purple-600 dark:text-purple-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen mt-4' : 'max-h-0'
        }`}
      >
        <div className="text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};
