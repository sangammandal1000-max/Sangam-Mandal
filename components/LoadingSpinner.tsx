import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
    <div className="w-12 h-12 border-4 border-t-transparent border-[var(--color-primary)] rounded-full animate-spin"></div>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .animate-spin {
        animation: spin 1s linear infinite;
      }
    `}</style>
  </div>
);

export default LoadingSpinner;