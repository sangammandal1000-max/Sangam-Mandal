import React from 'react';
import { InfoCircleIcon } from './icons/InfoCircleIcon';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface BulkDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemCount: number;
}

export const BulkDeleteConfirmationModal: React.FC<BulkDeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md m-4 transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <TrashIcon className="w-6 h-6" />
            Confirm Bulk Deletion
          </h2>
           <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <InfoCircleIcon className="w-10 h-10 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Are you sure you want to delete {itemCount} selected item{itemCount > 1 ? 's' : ''}?</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This action cannot be undone. The content will be permanently removed.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
            <TrashIcon className="w-4 h-4" />
            <span>Delete ({itemCount})</span>
          </button>
        </div>
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
