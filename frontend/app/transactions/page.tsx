'use client';

import React, { useState, useMemo } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TransactionTable } from '@/components/TransactionTable';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { EmptyState } from '@/components/EmptyState';
import { useTransactions, Transaction } from '@/context/TransactionContext';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TransactionsPage() {
  const { transactions, categories, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Income' | 'Expense'>('All');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Omit<Transaction, 'id'>) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
        setEditingTransaction(undefined);
      } else {
        await addTransaction(data);
      }
    } catch (error) {
      console.error('[v0] Error in submit handler:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('[v0] Error in delete handler:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-slate-400">Loading...</div>
      </div>
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
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">All Transactions</h1>
              <p className="text-slate-400">View and manage all your transactions</p>
            </div>
            <button
              onClick={() => {
                setEditingTransaction(undefined);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            {/* Search Box */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['All', 'Income', 'Expense'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as 'All' | 'Income' | 'Expense')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterType === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {type === 'All' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TransactionTable
              transactions={filteredTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showPagination={true}
            />
          </motion.div>

          {filteredTransactions.length === 0 && transactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-400">No transactions match your search or filter</p>
            </motion.div>
          )}
        </div>

        {/* Add/Edit Transaction Modal */}
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          categories={categories}
          editingTransaction={editingTransaction}
        />
      </PageLayout>
    </ProtectedRoute>
  );
}
