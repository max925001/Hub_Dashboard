'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Flame, Heart, Settings, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: t('sidebar.feed'), path: '/', icon: LayoutDashboard },
    { name: t('sidebar.trending'), path: '/trending', icon: Flame },
    { name: t('sidebar.favorites'), path: '/favorites', icon: Heart },
    { name: t('sidebar.settings'), path: '/settings', icon: Settings },
    { name: t('sidebar.profile'), path: '/profile', icon: User },
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen sticky top-0 border-r border-border/80 bg-card/30 glass z-30 select-none"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-border/40 h-[70px]">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-black tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase"
          >
            Hub Dashboard
          </motion.span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer ml-auto"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} href={item.path} className="block">
              <div
                className={clsx(
                  'flex items-center px-3 py-3 rounded-xl transition-all duration-200 group cursor-pointer relative',
                  isActive
                    ? 'text-primary font-bold bg-primary/10 border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={clsx('h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-105', isCollapsed ? 'mx-auto' : 'mr-3')} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm tracking-wide"
                  >
                    {item.name}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/40 text-center">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            Version 1.0.0
          </p>
        </div>
      )}
    </motion.div>
  );
}
export default Sidebar;
