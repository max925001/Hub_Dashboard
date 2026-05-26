'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Flame, Heart, Settings, User, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { clsx } from 'clsx';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    { name: t('sidebar.feed'), path: '/', icon: LayoutDashboard },
    { name: t('sidebar.trending'), path: '/trending', icon: Flame },
    { name: t('sidebar.favorites'), path: '/favorites', icon: Heart },
    { name: t('sidebar.settings'), path: '/settings', icon: Settings },
    { name: t('sidebar.profile'), path: '/profile', icon: User },
  ];

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer (AnimatePresence Overlay) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-card glass border-r border-border z-50 p-5 flex flex-col justify-between md:hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-border/40">
                  <span className="text-lg font-black tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
                    Hub Menu
                  </span>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="mt-6 space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                      <Link key={item.path} href={item.path} onClick={() => setIsMobileSidebarOpen(false)}>
                        <div
                          className={clsx(
                            'flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer',
                            isActive
                              ? 'text-primary font-bold bg-primary/10 border border-primary/20'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
                          )}
                        >
                          <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="text-sm">{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {session && (
                <div className="p-4 border-t border-border/40 flex items-center space-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user?.image || ''}
                    alt={session.user?.name || ''}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-foreground truncate">{session.user?.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onToggleMobileSidebar={handleToggleMobileSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export default MainLayout;
