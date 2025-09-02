import React from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { ShieldExclamationIcon } from './icons/ShieldExclamationIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div 
        className="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-sm relative animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
                <ShieldExclamationIcon className="h-6 w-6 text-red-400" />
            </div>
            <h2 id="confirmation-modal-title" className="text-xl font-bold text-red-300">{title}</h2>
            <p className="text-sm text-gray-400 mt-2">{message}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 p-4 bg-white/5 rounded-b-2xl">
            <button
                onClick={onClose}
                className="w-full bg-gray-600/50 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
                Delete
            </button>
        </div>

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close confirmation"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;