import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = foundUser;
        
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        
        return { success: true, user: userWithoutPassword };
      } else {
        const errorMessage = 'بيانات تسجيل الدخول غير صحيحة';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  // Add user methods
  const enhancedUser = user ? {
    ...user,
    canManageUsers: () => user.role === 'admin',
    canViewPatients: () => ['admin', 'doctor', 'receptionist'].includes(user.role),
    canModifyPatients: () => ['admin', 'receptionist'].includes(user.role),
    canViewPayments: () => ['admin', 'receptionist'].includes(user.role),
    canModifyPayments: () => ['admin', 'receptionist'].includes(user.role),
    canViewSessions: () => ['admin', 'doctor', 'receptionist'].includes(user.role),
    canModifySessions: () => ['admin', 'doctor', 'receptionist'].includes(user.role)
  } : null;

  const value = {
    user: enhancedUser,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    clearError,
    // Permissions
    hasPermission: (roles = []) => {
      if (!user) return false;
      if (roles.length === 0) return true;
      return roles.includes(user.role);
    },
    canManageUsers: () => user?.role === 'admin',
    canViewPatients: () => ['admin', 'doctor', 'receptionist'].includes(user?.role),
    canModifyPatients: () => ['admin', 'receptionist'].includes(user?.role),
    canViewPayments: () => ['admin', 'receptionist'].includes(user?.role),
    canModifyPayments: () => ['admin', 'receptionist'].includes(user?.role),
    canViewSessions: () => ['admin', 'doctor', 'receptionist'].includes(user?.role),
    canModifySessions: () => ['admin', 'doctor', 'receptionist'].includes(user?.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
