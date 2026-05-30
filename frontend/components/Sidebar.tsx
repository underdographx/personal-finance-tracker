'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CreditCard,
  BarChart3,
  Grid3x3
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { href: '/transactions', label: 'Transactions', icon: <CreditCard className="w-5 h-5" /> },
  { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { href: '/categories', label: 'Categories', icon: <Grid3x3 className="w-5 h-5" /> }
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isDark, setIsDark] = React.useState(true);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">💰</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Finance</h1>
            <p className="text-xs text-slate-400">Tracker</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500 bg-opacity-20 text-blue-400 border-l-2 border-blue-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-slate-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 bg-opacity-50 rounded-lg p-4 text-center"
        >
          <p className="text-sm text-slate-400 mb-3">Keep tracking!</p>
          <p className="text-xs text-slate-500 mb-4">
            You&apos;re doing great. Stay on top of your finances.
          </p>
          <div className="flex items-center justify-center">
            <span className="text-2xl">📈</span>
          </div>
        </motion.div>
      </div>
    </aside>
  );
};
