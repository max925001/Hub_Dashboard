'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { Search, Bell, Sun, Moon, Globe, LogOut, Check, Trash2, LogIn, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { setSearchQuery, selectSearchQuery } from '@/features/search/searchSlice';
import {
  selectNotifications,
  selectUnreadNotificationsCount,
  markAsRead,
  markAllAsRead,
  clearNotifications
} from '@/features/notifications/notificationsSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

interface TopNavbarProps {
  onToggleMobileSidebar?: () => void;
}

export function TopNavbar({ onToggleMobileSidebar }: TopNavbarProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  // Search State
  const globalSearchQuery = useAppSelector(selectSearchQuery);
  const [searchInput, setSearchInput] = useState(globalSearchQuery);
  const debouncedSearch = useDebounce(searchInput, 500);
  const [placeholderText, setPlaceholderText] = useState('Search...');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Notifications State
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadNotificationsCount);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sync debounced search input to global Redux query
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Sync search input if global search is cleared
  useEffect(() => {
    setSearchInput(globalSearchQuery);
  }, [globalSearchQuery]);

  // Handle dynamic placeholder resizing to prevent squeezing text on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPlaceholderText('Search...');
      } else {
        setPlaceholderText(t('navbar.searchPlaceholder'));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [t]);

  const handleLangChange = (lang: 'en' | 'hi') => {
    i18n.changeLanguage(lang);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-[70px] border-b border-border/80 bg-card/30 glass sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between select-none">
      
      {/* Left Search / Mobile hamburger */}
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-[120px] max-w-xs sm:max-w-lg mr-2">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer flex-shrink-0"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={placeholderText}
            className="w-full pl-10 pr-3 py-2 border border-border bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-4 flex-shrink-0">
        
        {/* Language Switcher (Desktop: dual buttons) */}
        <div className="hidden sm:flex items-center rounded-xl border border-border bg-card/50 p-0.5">
          <button
            onClick={() => handleLangChange('en')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              i18n.language === 'en' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => handleLangChange('hi')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              i18n.language === 'hi' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Language Switcher (Mobile: single toggle tag) */}
        <button
          onClick={() => handleLangChange(i18n.language === 'en' ? 'hi' : 'en')}
          className="flex sm:hidden px-2.5 py-2.5 rounded-xl border border-border bg-card/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shadow-sm text-xs font-black uppercase"
          title="Toggle Language"
        >
          {i18n.language === 'en' ? 'EN' : 'HI'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-border bg-card/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-sm"
          aria-label="Toggle Theme"
        >
          {mounted ? (
            theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4 opacity-0" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-2.5 rounded-xl border border-border bg-card/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer relative shadow-sm"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border border-background shadow-md shadow-rose-500/25 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                {/* Backdrop guard */}
                <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 max-h-96 overflow-hidden rounded-2xl border border-border bg-card glass shadow-2xl z-20 flex flex-col"
                >
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                    <span className="text-sm font-bold text-foreground">
                      {t('navbar.notifications')} ({unreadCount})
                    </span>
                    <div className="flex space-x-1.5">
                      <button
                        onClick={() => dispatch(markAllAsRead())}
                        title="Mark all as read"
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => dispatch(clearNotifications())}
                        title="Clear all"
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Items */}
                  <div className="overflow-y-auto flex-1 divide-y divide-border/60">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-muted-foreground">
                        No new notifications.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => dispatch(markAsRead(notif.id))}
                          className={`p-3 text-left transition-colors cursor-pointer hover:bg-muted/30 ${
                            !notif.read ? 'bg-primary/5 font-medium' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-semibold text-primary">{notif.title}</span>
                            <span className="text-[9px] text-muted-foreground">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          {session ? (
            <>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-xl border border-border bg-card/50 hover:bg-muted cursor-pointer transition-all shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={session.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                  alt={session.user?.name || 'User'}
                  className="h-7 w-7 rounded-lg object-cover"
                />
                <span className="text-xs font-semibold text-foreground hidden sm:inline-block max-w-[100px] truncate">
                  {session.user?.name}
                </span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-card glass shadow-2xl z-20 overflow-hidden"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="text-xs font-bold text-foreground truncate">{session.user?.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{session.user?.email}</p>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer font-semibold text-left"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('navbar.logout')}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => signIn()}
              className="flex items-center space-x-1"
            >
              <LogIn className="h-4 w-4" />
              <span>{t('navbar.login')}</span>
            </Button>
          )}
        </div>

      </div>

    </header>
  );
}
export default TopNavbar;
