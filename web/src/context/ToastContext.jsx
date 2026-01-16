import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast = ({ id, type, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-white border-l-4 border-green-500',
    error: 'bg-white border-l-4 border-red-500',
    info: 'bg-white border-l-4 border-blue-500'
  };

  return (
    <div className={`${bgColors[type] || bgColors.info} shadow-lg rounded-r-md p-4 mb-3 flex items-start w-80 transform transition-all duration-300 ease-in-out`}>
      <div className="flex-shrink-0 mr-3">
        {icons[type] || icons.info}
      </div>
      <div className="flex-1 mr-2">
        <p className="text-sm font-medium text-gray-900">{message}</p>
      </div>
      <button onClick={() => onClose(id)} className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
        removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = (message) => addToast(message, 'success');
  const error = (message) => addToast(message, 'error');
  const info = (message) => addToast(message, 'info');

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col items-end pointer-events-none">
         <div className="pointer-events-auto">
            {toasts.map((toast) => (
            <Toast
                key={toast.id}
                {...toast}
                onClose={removeToast}
            />
            ))}
         </div>
      </div>
    </ToastContext.Provider>
  );
};
