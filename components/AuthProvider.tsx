import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'member';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, adminSecret?: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
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
    const raw = localStorage.getItem('jvepi_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async (email: string, password: string, adminSecret?: string) => {
    // Fake auth: accept any credentials. Admin elevation via secret.
    const { ADMIN_SECRET } = await import('./adminConfig');
    const isAdmin = (adminSecret && adminSecret === ADMIN_SECRET) || email.includes('admin');
    const u: User = { id: String(Date.now()), name: email.split('@')[0], email, role: isAdmin ? 'admin' : 'member' };
    localStorage.setItem('jvepi_user', JSON.stringify(u));
    setUser(u);
    // debug log
    // eslint-disable-next-line no-console
    console.log('AuthProvider.login -> user', u);
    return u;
  };

  const register = async (name: string, email: string, password: string) => {
    const u: User = { id: String(Date.now()), name, email, role: 'member' };
    localStorage.setItem('jvepi_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('jvepi_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
