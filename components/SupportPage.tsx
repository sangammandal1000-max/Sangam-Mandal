


import React, { useRef } from 'react';
import { Header } from './Header';
// FIX: Changed named import for Footer to a default import to match its export type.
import Footer from './Footer';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { useDesign } from '../../contexts/DesignContext';
import { Category } from '../types';

interface SupportPageProps {
  pageData: {
    title: string;
    content: React.ReactNode | ((siteName: string, categories: Category[]) => React.ReactNode);
  };
  onBack: () => void;
  onSearchClick: () => void;
  onMenuClick: () => void;
  categories: Category[];
}

const SupportPage: React.FC<SupportPageProps> = ({ pageData, onBack, onSearchClick, onMenuClick, categories }) => {
  const { siteName } = useDesign();

  // --- Start of swipe-to-go-back logic ---
  const touchStartX = useRef(0);
  const touchMoveX = useRef(0);
  // Threshold in pixels for a swipe to be registered
  const SWIPE_THRESHOLD = 75;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Capture the starting X position of the first touch point
    touchStartX.current = e.targetTouches[0].clientX;
    touchMoveX.current = 0; // Reset move position
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Update the current X position as the finger moves
    touchMoveX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    // If there was no significant movement, do nothing
    if (touchStartX.current === 0 || touchMoveX.current === 0) return;

    const swipeDistance = touchMoveX.current - touchStartX.current;

    // If the swipe distance is positive (rightward) and exceeds the threshold, navigate back
    if (swipeDistance > SWIPE_THRESHOLD) {
      onBack();
    }

    // Reset touch positions for the next gesture
    touchStartX.current = 0;
    touchMoveX.current = 0;
  };
  // --- End of swipe-to-go-back logic ---

  return (
    <div 
      className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Header onSearchClick={onSearchClick} onMenuClick={onMenuClick} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow w-full">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 font-semibold transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
        
        {/* Main content container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8 md:p-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
              {pageData.title}
            </h1>
            {/* The content from constants files is rendered here */}
            <div>
              {typeof pageData.content === 'function' ? pageData.content(siteName, categories) : pageData.content}
            </div>
        </div>
      </main>
      <Footer categories={categories} />
    </div>
  );
};

export default SupportPage;
