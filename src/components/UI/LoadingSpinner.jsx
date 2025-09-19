import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'gold', 
  text = null, 
  className = '',
  fullScreen = false 
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    gold: 'border-gold-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    gray: 'border-gray-500'
  };

  const spinner = (
    <div className={cn(
      'animate-spin rounded-full border-2 border-gray-200',
      sizeClasses[size],
      colorClasses[color],
      'border-t-transparent',
      className
    )} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          {spinner}
          {text && (
            <p className="text-gray-600 text-sm font-medium">
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        {spinner}
        <span className="text-gray-600 text-sm font-medium">
          {text}
        </span>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
