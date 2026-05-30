'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SpendingChartProps {
  data: { category: string; amount: number }[];
}

// Premium fintech color palette
const COLORS = [
  '#8b5cf6',  // Purple
  '#3b82f6',  // Blue
  '#06b6d4',  // Cyan
  '#ec4899',  // Pink
  '#14b8a6'   // Teal
];

export const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        No spending data available
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.category,
    value: parseFloat(item.amount.toFixed(2))
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `$${value.toFixed(2)}`}
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#e2e8f0'
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{
            color: '#cbd5e1'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
