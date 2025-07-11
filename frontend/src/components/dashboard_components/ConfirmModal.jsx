import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 transition-all duration-300 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-red-500 to-pink-600">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 transition-colors rounded-lg hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-6 text-gray-700">{message}</p>
          
          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 text-white transition-colors rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;