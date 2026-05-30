'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileSidebar } from '@/components/MobileSidebar';
import { Header } from '@/components/Header';
import { Menu } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <Header />

        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-20 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">💰</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">Finance</h1>
                <p className="text-xs text-slate-400">Tracker</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};
