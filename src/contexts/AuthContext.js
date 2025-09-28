import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      authAPI.getMe()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          sessionStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      
      sessionStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      sessionStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  }), [user, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};