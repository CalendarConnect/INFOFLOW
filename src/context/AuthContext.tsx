'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check for existing auth on mount
    const auth = getCookie('auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      // Set both cookie and localStorage for compatibility
      setCookie('auth', 'true', { maxAge: 60 * 60 * 24 * 7 }); // 7 days
      localStorage.setItem('auth', 'true');
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    deleteCookie('auth');
    localStorage.removeItem('auth');
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 