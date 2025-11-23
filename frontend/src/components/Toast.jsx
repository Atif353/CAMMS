import { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

/**
 * TOAST NOTIFICATION SYSTEM
 * 
 * Purpose: Show temporary success/error/info messages to users
 * 
 * Easy to explain in viva:
 * - "I created a global toast notification system using React Context"
 * - "Toasts appear at top-right, auto-dismiss after 3 seconds"
 * - "Different colors for success (green), error (red), info (blue)"
 * - "Users can manually dismiss by clicking X"
 * 
 * Technical concepts:
 * - React Context API for global state
 * - Custom hooks for easy usage
 * - CSS animations for smooth entry/exit
 * - Auto-dismiss with setTimeout
 */

const ToastContext = createContext();

// Custom hook to use toast from any component
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  // Remove a toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods
  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message) => addToast(message, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info }}>
      {children}
      
      {/* Toast Container - Fixed position at top-right */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  // Different styles for different types
  const styles = {
    success: {
      bg: 'bg-success-50 dark:bg-success-900',
      border: 'border-success-500',
      text: 'text-success-800 dark:text-success-100',
      icon: <FiCheckCircle className="text-success-500" />,
    },
    error: {
      bg: 'bg-danger-50 dark:bg-danger-900',
      border: 'border-danger-500',
      text: 'text-danger-800 dark:text-danger-100',
      icon: <FiAlertCircle className="text-danger-500" />,
    },
    info: {
      bg: 'bg-primary-50 dark:bg-primary-900',
      border: 'border-primary-500',
      text: 'text-primary-800 dark:text-primary-100',
      icon: <FiInfo className="text-primary-500" />,
    },
  };

  const style = styles[toast.type] || styles.info;

  return (
    <div
      className={`
        ${style.bg} ${style.border} ${style.text}
        border-l-4 p-4 rounded-lg shadow-lg
        min-w-[300px] max-w-md
        animate-slide-down
        flex items-center justify-between
        backdrop-blur-sm
      `}
    >
      <div className="flex items-center space-x-3">
        {style.icon}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <FiX />
      </button>
    </div>
  );
};

