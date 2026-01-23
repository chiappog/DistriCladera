import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { INITIAL_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'auth_user_id';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Limpiar localStorage al iniciar para siempre mostrar pantalla de login
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = (userId: string) => {
    const foundUser = INITIAL_USERS.find(u => u.id === userId);
    if (foundUser && foundUser.status) {
      localStorage.setItem(STORAGE_KEY, userId);
      setUser(foundUser);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
