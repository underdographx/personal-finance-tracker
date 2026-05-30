'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount and initialize demo user
  useEffect(() => {
    const savedUser = localStorage.getItem('financeTrackerUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('[v0] Error parsing saved user:', error);
      }
    } else {
      // Initialize demo user if no users exist
      const existingUsers = localStorage.getItem('financeTrackerUsers');
      if (!existingUsers) {
        const demoUsers = [
          {
            id: '1',
            name: 'Anuja',
            email: 'demo@example.com',
            password: 'demo123',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo@example.com'
          }
        ];
        localStorage.setItem('financeTrackerUsers', JSON.stringify(demoUsers));
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('financeTrackerUsers') || '[]');
    if (users.some((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };

    // Store user password (in production, this should be hashed on a secure backend)
    users.push({ email, password, ...newUser });
    localStorage.setItem('financeTrackerUsers', JSON.stringify(users));

    // Auto-login after registration
    setUser(newUser);
    localStorage.setItem('financeTrackerUser', JSON.stringify(newUser));
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('financeTrackerUsers') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('financeTrackerUser', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('financeTrackerUser');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
