'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Transaction {
  id: string;
  description: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
  date: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  getTotalBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getSpendingByCategory: () => { category: string; amount: number }[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const API_URL = 'http://localhost:3001/api';

// Default categories for new users
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#8b5cf6' },
  { id: '2', name: 'Transport', color: '#3b82f6' },
  { id: '3', name: 'Shopping', color: '#06b6d4' },
  { id: '4', name: 'Entertainment', color: '#ec4899' },
  { id: '5', name: 'Bills & Utilities', color: '#14b8a6' },
  { id: '6', name: 'Education', color: '#8b5cf6' },
  { id: '7', name: 'Healthcare', color: '#3b82f6' },
  { id: '8', name: 'Travel', color: '#06b6d4' }
];

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user-specific storage key
  const getUserTransactionsKey = () => {
    if (!user?.email) return null;
    return `financeTracker_transactions_${user.email}`;
  };

  // Load user transactions from localStorage
  const loadUserTransactions = () => {
    const key = getUserTransactionsKey();
    if (!key) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const saved = localStorage.getItem(key);
      if (saved) {
        setTransactions(JSON.parse(saved));
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('[v0] Error loading user transactions:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Save user transactions to localStorage
  const saveUserTransactions = (txns: Transaction[]) => {
    const key = getUserTransactionsKey();
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(txns));
    } catch (err) {
      console.error('[v0] Error saving user transactions:', err);
    }
  };

  // Load user transactions when user changes
  useEffect(() => {
    if (user?.email) {
      loadUserTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [user?.email]);

  const refreshTransactions = async () => {
    loadUserTransactions();
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user?.email) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    saveUserTransactions(updated);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user?.email) return;
    
    const updated = transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    setTransactions(updated);
    saveUserTransactions(updated);
  };

  const deleteTransaction = async (id: string) => {
    if (!user?.email) return;
    
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveUserTransactions(updated);
  };

  const getTotalBalance = () => {
    return transactions.reduce((acc, t) => {
      return t.type === 'Income' ? acc + t.amount : acc - t.amount;
    }, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getSpendingByCategory = () => {
    const spending: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'Expense')
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });
    return Object.entries(spending).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        categories,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshTransactions,
        getTotalBalance,
        getTotalIncome,
        getTotalExpenses,
        getSpendingByCategory
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
