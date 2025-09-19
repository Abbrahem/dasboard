import React, { createContext, useContext, useReducer } from 'react';
import Toast from '../components/UI/Toast';

// Initial state
const initialState = {
  toasts: []
};

// Action types
const TOAST_ACTIONS = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  CLEAR_TOASTS: 'CLEAR_TOASTS'
};

// Reducer
const toastReducer = (state, action) => {
  switch (action.type) {
    case TOAST_ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    
    case TOAST_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    case TOAST_ACTIONS.CLEAR_TOASTS:
      return {
        ...state,
        toasts: []
      };
    
    default:
      return state;
  }
};

// Create context
const ToastContext = createContext();

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  // Add toast
  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };

    dispatch({
      type: TOAST_ACTIONS.ADD_TOAST,
      payload: newToast
    });

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  // Remove toast
  const removeToast = (id) => {
    dispatch({
      type: TOAST_ACTIONS.REMOVE_TOAST,
      payload: id
    });
  };

  // Clear all toasts
  const clearToasts = () => {
    dispatch({ type: TOAST_ACTIONS.CLEAR_TOASTS });
  };

  // Convenience methods
  const showSuccess = (message, options = {}) => {
    return addToast({
      type: 'success',
      message,
      ...options
    });
  };

  const showError = (message, options = {}) => {
    return addToast({
      type: 'error',
      message,
      duration: 7000, // Longer duration for errors
      ...options
    });
  };

  const showWarning = (message, options = {}) => {
    return addToast({
      type: 'warning',
      message,
      ...options
    });
  };

  const showInfo = (message, options = {}) => {
    return addToast({
      type: 'info',
      message,
      ...options
    });
  };

  const value = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={state.toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

export default ToastContext;
