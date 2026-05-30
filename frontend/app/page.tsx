'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StatCard } from '@/components/StatCard';
import { TransactionTable } from '@/components/TransactionTable';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { SpendingChart } from '@/components/SpendingChart';
import { EmptyState } from '@/components/EmptyState';
import { useTransactions } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { user } = useAuth();
  const { transactions, categories, loading, addTransaction, deleteTransaction, getTotalBalance, getTotalIncome, getTotalExpenses, getSpendingByCategory } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalBalance = getTotalBalance();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const spendingByCategory = getSpendingByCategory();

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('[v0] Error in delete handler:', error);
      }
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-slate-400">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  // Show empty state if no transactions
  if (!loading && transactions.length === 0) {
    return (
      <ProtectedRoute>
        <PageLayout>
          <div className="p-8 flex flex-col items-center justify-center min-h-screen">
            <EmptyState
              title="No Transactions Yet"
              description="Start tracking your finances by adding your first transaction. You can add income, expenses, and watch your dashboard come to life."
              icon="💰"
              actionLabel="Add Your First Transaction"
              onAction={() => setIsModalOpen(true)}
            />
            <AddTransactionModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={addTransaction}
              categories={categories}
            />
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
            <h1 className="text-4xl font-bold text-white mb-2">Hey, {user?.name} 👋</h1>
            <p className="text-slate-400">Here&apos;s what&apos;s happening with your finances.</p>
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Balance"
              value={totalBalance}
              change={12.5}
              icon="💳"
              bgColor="bg-purple-500 bg-opacity-20"
              textColor="text-purple-400"
            />
            <StatCard
              title="Total Income"
              value={totalIncome}
              change={8.3}
              trend="up"
              icon="📈"
              bgColor="bg-green-500 bg-opacity-20"
              textColor="text-green-400"
            />
            <StatCard
              title="Total Expenses"
              value={totalExpenses}
              change={5.2}
              trend="down"
              icon="📉"
              bgColor="bg-red-500 bg-opacity-20"
              textColor="text-red-400"
            />
            <StatCard
              title="Savings"
              value={totalBalance}
              change={15.2}
              trend="up"
              icon="💰"
              bgColor="bg-blue-500 bg-opacity-20"
              textColor="text-blue-400"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Spending Overview</h2>
              <SpendingChart data={spendingByCategory} />
              <button className="mt-4 text-sm text-blue-400 hover:text-blue-300">
                View Full Report →
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Top Spending Categories</h3>
              <div className="space-y-3">
                {spendingByCategory.slice(0, 5).map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-sm text-slate-300">{item.category}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-200">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Transaction
              </button>
            </div>
            <TransactionTable
              transactions={recentTransactions}
              onDelete={handleDeleteTransaction}
              showPagination={false}
            />
            <div className="mt-4 text-center">
              <a
                href="/transactions"
                className="text-blue-400 hover:text-blue-300 font-medium text-sm"
              >
                View All Transactions →
              </a>
            </div>
          </motion.div>
        </div>

        {/* Add Transaction Modal */}
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={addTransaction}
          categories={categories}
        />
      </PageLayout>
    </ProtectedRoute>
  );
}
