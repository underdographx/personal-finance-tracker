'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  trend?: 'up' | 'down';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  bgColor,
  textColor,
  trend = 'up'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-slate-600 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-2">
            ${value.toFixed(2)}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${bgColor}`}>
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? '+' : '-'}{Math.abs(change).toFixed(1)}%
          </span>
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4 text-green-400" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          )}
          <span className="text-slate-500 text-xs">from last month</span>
        </div>
      )}
    </motion.div>
  );
};
