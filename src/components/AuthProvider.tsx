import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

type User = {
  id: number | string;
  username?: string;
  email?: string;
  api_key?: string;
  role?: 'admin' | 'member' | string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string, isAdmin?: boolean) => Promise<User | null>;
  register: (username: string, email: string, password: string, isAdmin?: boolean) => Promise<User | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Restore user from localStorage (PHP backend uses API key auth)
    const raw = localStorage.getItem('jvepi_user');
    if (raw) {
      try {
        const userData = JSON.parse(raw);
        setUser(userData);
        // Set API key header if available
        if (userData.api_key) {
          api.defaults.headers.common['X-ADMIN-KEY'] = userData.api_key;
        }
      } catch (e) {
        localStorage.removeItem('jvepi_user');
      }
    }
  }, []);

  const login = async (username: string, password: string, isAdmin: boolean = false) => {
    try {
      // Validation côté client
      if (!username.trim()) throw new Error('Nom d\'utilisateur requis');
      if (!password.trim()) throw new Error('Mot de passe requis');

      if (isAdmin) {
        // Connexion admin
        const res = await api.post('/admin/login', { username, password });
        if (res.data.ok && res.data.admin) {
          const userData = { 
            ...res.data.admin, 
            role: 'admin',
            name: res.data.admin.username
          };
          setUser(userData);
          localStorage.setItem('jvepi_user', JSON.stringify(userData));
          // Set API key header for future requests
          if (userData.api_key) {
            api.defaults.headers.common['X-ADMIN-KEY'] = userData.api_key;
          }
          return userData;
        } else {
          throw new Error('Identifiants administrateur invalides');
        }
      } else {
        // Connexion utilisateur normal
        const res = await api.post('/user/login', { username, password });
        if (res.data.ok && res.data.user) {
          const userData = {
            id: res.data.user.id,
            username: res.data.user.username,
            name: res.data.user.username,
            role: 'user',
            login_at: res.data.user.login_at
          };
          setUser(userData);
          localStorage.setItem('jvepi_user', JSON.stringify(userData));
          return userData;
        } else {
          throw new Error('Identifiants utilisateur invalides');
        }
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      // Gérer les erreurs spécifiques du backend
      if (err.response?.status === 401) {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
      } else if (err.response?.status === 400) {
        throw new Error(err.response.data?.error || 'Données invalides');
      } else if (err.message) {
        throw new Error(err.message);
      }
      throw new Error('Erreur lors de la connexion');
    }
  };

  const register = async (username: string, email: string, password: string, isAdmin: boolean = false) => {
    try {
      // Validation côté client
      if (!username.trim()) throw new Error('Le nom d\'utilisateur est requis');
      if (!email.trim() || !email.includes('@')) throw new Error('Email valide requis');
      if (password.length < 6) throw new Error('Mot de passe minimum 6 caractères');

      if (isAdmin) {
        // Inscription admin via API backend
        const res = await api.post('/admin/register', { username, email, password });
        
        if (res.data.ok && res.data.api_key) {
          const userData = { 
            id: res.data.id, 
            username, 
            email, 
            api_key: res.data.api_key, 
            role: 'admin',
            name: username
          };
          setUser(userData);
          localStorage.setItem('jvepi_user', JSON.stringify(userData));
          // Set API key header for future requests
          api.defaults.headers.common['X-ADMIN-KEY'] = userData.api_key;
          return userData;
        } else {
          throw new Error(res.data.error || 'Erreur lors de l\'inscription admin');
        }
      } else {
        // Inscription utilisateur normal via API backend
        const res = await api.post('/user/register', { username, email, password });
        
        if (res.data.ok && res.data.user) {
          const userData = {
            id: res.data.user.id,
            username: res.data.user.username,
            email: res.data.user.email,
            name: res.data.user.username,
            role: 'user',
            created_at: res.data.user.created_at
          };
          
          setUser(userData);
          localStorage.setItem('jvepi_user', JSON.stringify(userData));
          return userData;
        } else {
          throw new Error(res.data.error || 'Erreur lors de l\'inscription utilisateur');
        }
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      // Gérer les erreurs spécifiques du backend
      if (err.response?.status === 409) {
        throw new Error('Ce nom d\'utilisateur existe déjà');
      } else if (err.response?.status === 400) {
        throw new Error(err.response.data?.error || 'Données invalides');
      } else if (err.message) {
        throw new Error(err.message);
      }
      throw new Error('Erreur lors de l\'inscription');
    }
  };

  const logout = async () => {
    localStorage.removeItem('jvepi_user');
    delete api.defaults.headers.common['X-ADMIN-KEY'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
