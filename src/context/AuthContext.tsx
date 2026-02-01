'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

export interface User {
  id: string;
  email: string;
  full_name: string; 
  city?: string;   
  phone?: string; 
  birth_date?: string;   
  monthly_income?: number; 
  ai_score?: number;
  created_at?: string;
  avatar_url?: string;
  credit_score?: number;
  monthly_expenses?: number;
  total_monthly_payments?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (e: string, p: string) => Promise<void>;
  register: (e: string, p: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => Promise<void>;
  showAuthModal: boolean;
  openAuthModal: (redirect?: string) => void;
  closeAuthModal: () => void;
  postLoginRedirect: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await api.getMe(token);
          setUser(userData);
        } catch (error) {
          console.error("Session expired or invalid token");
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const handleExpire = () => logout();
    window.addEventListener('session-expired', handleExpire);
    return () => window.removeEventListener('session-expired', handleExpire);
  }, []);

  const openAuthModal = (redirect?: string) => {
    if (redirect) setPostLoginRedirect(redirect);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setPostLoginRedirect(null);
  };

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    await setToken(data.access_token);
  };

  const register = async (email: string, password: string, full_name: string = "") => {
    const data = await api.register(email, password, full_name);
    await setToken(data.access_token);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    closeAuthModal();
  };

  const setToken = async (token: string) => {
    localStorage.setItem('access_token', token);
    
    try {
      const userData = await api.getMe(token); 
      setUser(userData);
      closeAuthModal();

      if (postLoginRedirect) {
        window.location.href = postLoginRedirect;
      }
    } catch (error) {
      console.error("Ошибка при получении данных юзера", error);
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setToken,
        showAuthModal,
        openAuthModal,
        closeAuthModal,
        postLoginRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}