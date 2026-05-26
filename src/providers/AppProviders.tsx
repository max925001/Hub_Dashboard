'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';
import { store, persistor } from '@/store';
import '@/lib/i18n'; // Initialize i18n configuration

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering dummy structure on server
    return (
      <Provider store={store}>
        <SessionProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <div className="opacity-0">{children}</div>
          </NextThemesProvider>
        </SessionProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <DndProvider backend={HTML5Backend}>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className: 'bg-card text-foreground border border-border shadow-lg rounded-xl',
                  duration: 4000,
                  style: {
                    background: 'var(--card)',
                    color: 'var(--foreground)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border)',
                  }
                }}
              />
            </DndProvider>
          </NextThemesProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}
export default AppProviders;
