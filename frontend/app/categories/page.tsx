'use client';

import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { EmptyState } from '@/components/EmptyState';
import { useTransactions } from '@/context/TransactionContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CategoriesPage() {
  const { categories, transactions, loading, getSpendingByCategory } = useTransactions();
  const spendingByCategory = getSpendingByCategory();

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#6366f1';
  };

  const getCategorySpending = (categoryName: string) => {
    const spending = spendingByCategory.find(s => s.category === categoryName);
    return spending?.amount || 0;
  };

  const getCategoryTransactionCount = (categoryName: string) => {
    return transactions.filter(t => t.category === categoryName && t.type === 'Expense').length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  // Show empty state if no expenses
  if (transactions.length === 0 || spendingByCategory.length === 0) {
    return (
      <ProtectedRoute>
        <PageLayout>
          <div className="p-8 flex flex-col items-center justify-center min-h-screen">
            <EmptyState
              title="No Spending Yet"
              description="Once you add expenses, you'll see them broken down by category here."
              icon="🏷️"
            />
            <Link
              href="/"
              className="mt-8 text-blue-400 hover:text-blue-300 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Categories</h1>
            <p className="text-slate-400">Manage and view your spending by category</p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const spending = getCategorySpending(category.name);
              const transactionCount = getCategoryTransactionCount(category.name);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <span>💰</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{category.name}</h3>
                        <p className="text-xs text-slate-400">{transactionCount} transactions</p>
                      </div>
                    </div>
                  </div>

                  {/* Spending Amount */}
                  <div className="mb-4">
                    <p className="text-slate-400 text-sm mb-1">Total Spending</p>
                    <p className="text-2xl font-bold text-white">${spending.toFixed(2)}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: category.color,
                          width: spending > 0 ? '100%' : '0%'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Average Transaction */}
                  {transactionCount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Average per transaction</span>
                      <span className="text-slate-200 font-semibold">
                        ${(spending / transactionCount).toFixed(2)}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Category Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6">Category Breakdown</h2>
            <div className="space-y-4">
              {spendingByCategory.map((item, index) => {
                const categoryColor = getCategoryColor(item.category);
                const category = categories.find(c => c.name === item.category);

                return (
                  <div key={item.category} className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: categoryColor }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 font-medium">{item.category}</span>
                        <span className="text-slate-200 font-semibold">${item.amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: categoryColor,
                            width: `${
                              spendingByCategory.reduce((sum, s) => sum + s.amount, 0) > 0
                                ? (item.amount / spendingByCategory.reduce((sum, s) => sum + s.amount, 0)) * 100
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
