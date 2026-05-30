'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CreditCard,
  BarChart3,
  Grid3x3,
  Settings,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { href: '/transactions', label: 'Transactions', icon: <CreditCard className="w-5 h-5" /> },
  { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { href: '/categories', label: 'Categories', icon: <Grid3x3 className="w-5 h-5" /> },
  { href: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40 flex flex-col overflow-y-auto"
          >
            {/* Close Button */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">💰</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Finance</h1>
                  <p className="text-xs text-slate-400">Tracker</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link href={item.href} onClick={onClose}>
                        <div
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            isActive
                              ? 'bg-blue-500 bg-opacity-20 text-blue-400 border-l-2 border-blue-400'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
              <div className="bg-slate-800 bg-opacity-50 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400 mb-3">Keep tracking!</p>
                <p className="text-xs text-slate-500">
                  You&apos;re doing great.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
