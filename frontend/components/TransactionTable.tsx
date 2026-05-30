'use client';

import React, { useState } from 'react';
import { Transaction } from '@/context/TransactionContext';
import { Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  showPagination?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  showPagination = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = transactions.slice(startIdx, startIdx + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 bg-opacity-50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                  Date
                </th>
                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {paginatedTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-700 hover:bg-opacity-30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{transaction.icon || '💰'}</span>
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'Income'
                          ? 'bg-green-900 bg-opacity-30 text-green-400'
                          : 'bg-red-900 bg-opacity-30 text-red-400'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-right">
                    <span
                      className={
                        transaction.type === 'Income'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }
                    >
                      {transaction.type === 'Income' ? '+' : '-'}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {formatDate(transaction.date)}
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(transaction)}
                            className="p-2 hover:bg-blue-500 hover:bg-opacity-20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-400" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(transaction.id)}
                            className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            if (pageNum > totalPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
