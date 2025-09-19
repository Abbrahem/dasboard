import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils';

const Toast = ({ toasts, onRemove }) => {
  const getIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle {...iconProps} className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info {...iconProps} className="w-5 h-5 text-blue-500" />;
    }
  };

  const getToastStyles = (type) => {
    const baseStyles = "border-l-4 bg-white shadow-lg";
    
    switch (type) {
      case 'success':
        return cn(baseStyles, "border-green-500");
      case 'error':
        return cn(baseStyles, "border-red-500");
      case 'warning':
        return cn(baseStyles, "border-yellow-500");
      case 'info':
      default:
        return cn(baseStyles, "border-blue-500");
    }
  };

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 rtl:right-auto rtl:left-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            getToastStyles(toast.type),
            "min-w-80 max-w-md p-4 rounded-md shadow-lg",
            "transform transition-all duration-300 ease-in-out",
            "animate-fade-in"
          )}
        >
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="flex-shrink-0">
              {getIcon(toast.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {toast.title}
                </h4>
              )}
              <p className="text-sm text-gray-700">
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {toast.action && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={toast.action.onClick}
                className="text-sm font-medium text-gold-600 hover:text-gold-500 transition-colors"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Toast;
