import React from 'react';
import { cn } from '../../utils';

const Input = React.forwardRef(({
  className = '',
  type = 'text',
  label = '',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  placeholder = '',
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseInputStyles = "block w-full rounded-md border-gray-300 shadow-sm transition-colors duration-200 focus:border-gold-500 focus:ring-gold-500 disabled:bg-gray-50 disabled:text-gray-500";

  const inputWithIconStyles = {
    left: icon ? "pl-10 rtl:pl-3 rtl:pr-10" : "",
    right: icon ? "pr-10 rtl:pr-3 rtl:pl-10" : ""
  };

  const errorStyles = error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "";

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {icon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            baseInputStyles,
            inputWithIconStyles[iconPosition],
            errorStyles,
            className
          )}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {icon}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
