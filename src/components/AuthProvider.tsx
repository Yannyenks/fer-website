import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import axios from 'axios';

type User = {
  id: number | string;
  name?: string;
  email?: string;
  role?: 'admin' | 'member' | string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// derive API root from VITE_API_URL (which points to /api)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const AUTH_ROOT = (import.meta.env.VITE_API_BASE || API_URL.replace(/\/api\/?$/i, ''));

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Try to restore user from API (Sanctum cookie flow)
    (async () => {
      try {
        const res = await api.get('/user');
        setUser(res.data);
        // also persist a local copy for fallback
        localStorage.setItem('jvepi_user', JSON.stringify(res.data));
      } catch (e) {
        // fallback to localStorage
        const raw = localStorage.getItem('jvepi_user');
        if (raw) setUser(JSON.parse(raw));
      }
    })();
  }, []);

  const refreshUser = async (): Promise<User | null> => {
    try {
      const res = await api.get('/user');
      setUser(res.data);
      localStorage.setItem('jvepi_user', JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Get CSRF cookie from Laravel Sanctum
      await axios.get(`${AUTH_ROOT}/sanctum/csrf-cookie`, { withCredentials: true });
      // Post credentials to login endpoint (root /login)
      await axios.post(`${AUTH_ROOT}/login`, { email, password }, { withCredentials: true });
      // Fetch authenticated user via API
      const res = await api.get('/user');
      setUser(res.data);
      localStorage.setItem('jvepi_user', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      // login failed
      return null;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.get(`${AUTH_ROOT}/sanctum/csrf-cookie`, { withCredentials: true });
      await axios.post(`${AUTH_ROOT}/register`, { name, email, password }, { withCredentials: true });
      const res = await api.get('/user');
      setUser(res.data);
      localStorage.setItem('jvepi_user', JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      return null;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${AUTH_ROOT}/logout`, {}, { withCredentials: true });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('jvepi_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
