'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/context/TransactionContext';

interface IncomeVsExpensesChartProps {
  transactions: Transaction[];
}

export const IncomeVsExpensesChart: React.FC<IncomeVsExpensesChartProps> = ({ transactions }) => {
  const data = getDailyData(transactions);

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="date" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          formatter={(value) => `$${value.toFixed(2)}`}
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#e2e8f0'
          }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Legend wrapperStyle={{ color: '#cbd5e1' }} />
        <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

function getDailyData(transactions: Transaction[]) {
  const dailyMap: { [key: string]: { income: number; expenses: number } } = {};

  transactions.forEach(t => {
    if (!dailyMap[t.date]) {
      dailyMap[t.date] = { income: 0, expenses: 0 };
    }

    if (t.type === 'Income') {
      dailyMap[t.date].income += t.amount;
    } else {
      dailyMap[t.date].expenses += t.amount;
    }
  });

  return Object.entries(dailyMap)
    .map(([date, values]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income: values.income,
      expenses: values.expenses
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(-7); // Get last 7 days
}
