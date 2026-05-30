'use client';

import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StatCard } from '@/components/StatCard';
import { SpendingChart } from '@/components/SpendingChart';
import { IncomeVsExpensesChart } from '@/components/IncomeVsExpensesChart';
import { EmptyState } from '@/components/EmptyState';
import { useTransactions } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { transactions, loading, getTotalBalance, getTotalIncome, getTotalExpenses, getSpendingByCategory } = useTransactions();

  const totalBalance = getTotalBalance();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const spendingByCategory = getSpendingByCategory();

  // Calculate percentages
  const savingsPercentage = totalIncome > 0 ? ((totalBalance / totalIncome) * 100).toFixed(1) : 0;

  // Get top 5 spending categories
  const topCategories = spendingByCategory.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  // Show empty state if no transactions
  if (!loading && transactions.length === 0) {
    return (
      <ProtectedRoute>
        <PageLayout>
          <div className="p-8 flex flex-col items-center justify-center min-h-screen">
            <EmptyState
              title="No Analytics Yet"
              description="Add your first transaction to see your financial analytics, spending breakdown, and income vs expenses charts."
              icon="📊"
              actionLabel="Add Transaction"
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
            <h1 className="text-4xl font-bold text-white mb-2">Hey, {user?.name} 👋</h1>
            <p className="text-slate-400">Here&apos;s your financial overview</p>
          </motion.div>

          {/* Key Metrics */}
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
              title="Savings Rate"
              value={parseFloat(savingsPercentage as string)}
              icon="🎯"
              bgColor="bg-blue-500 bg-opacity-20"
              textColor="text-blue-400"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Income vs Expenses</h2>
              <IncomeVsExpensesChart transactions={transactions} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Spending Overview</h2>
              <SpendingChart data={spendingByCategory} />
            </motion.div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6">Monthly Summary</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Income</span>
                  <span className="text-xl font-bold text-green-400">${totalIncome.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-700"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Expenses</span>
                  <span className="text-xl font-bold text-red-400">${totalExpenses.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-700"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Net Balance</span>
                  <span className={`text-xl font-bold ${totalBalance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    ${totalBalance.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-slate-700"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Savings Rate</span>
                  <span className="text-xl font-bold text-blue-400">{savingsPercentage}%</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Top Spending Categories</h3>
              <div className="space-y-3">
                {topCategories.map((item, index) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">{item.category}</span>
                      <span className="text-sm font-semibold text-slate-200">${item.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{
                          width: `${totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
