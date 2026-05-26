'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/store';
import { selectPreferences } from '@/features/preferences/preferencesSlice';
import { User, Mail, ShieldAlert, Award, Layers, Sparkles } from 'lucide-react';

export function ProfileView() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const preferences = useAppSelector(selectPreferences);

  if (!session) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <User className="h-7 w-7 text-primary" />
          {t('sidebar.profile')}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review your account profile and current preferences configurations.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-card/45 border border-border p-6 rounded-2xl glass shadow-xl space-y-6">
        
        {/* Banner Details */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-border/40">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={session.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
              alt={session.user?.name || 'User'}
              className="h-20 w-20 rounded-2xl object-cover border border-border shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-lg shadow">
              <Sparkles className="h-3.5 w-3.5 fill-white" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              {session.user?.name}
            </h2>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span>{session.user?.email}</span>
            </div>
            <div className="inline-block px-2.5 py-0.5 mt-2 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Active Member
            </div>
          </div>
        </div>

        {/* Configurations list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Favorite Categories */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-indigo-400" />
              Favorite Categories
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {preferences.favoriteCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize"
                >
                  {t(`categories.${cat}`, cat)}
                </span>
              ))}
            </div>
          </div>

          {/* Preferences Settings */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-sky-400" />
              Dashboard Settings
            </h3>
            <ul className="text-xs text-foreground/80 space-y-1.5 pt-1">
              <li>
                <span className="font-bold text-muted-foreground">Language:</span>{' '}
                {preferences.language === 'en' ? 'English' : 'हिंदी (Hindi)'}
              </li>
              <li>
                <span className="font-bold text-muted-foreground">Interface Theme:</span>{' '}
                <span className="capitalize">{preferences.theme}</span>
              </li>
              <li>
                <span className="font-bold text-muted-foreground">Card Density:</span>{' '}
                {preferences.compactMode ? 'Compact' : 'Comfortable'}
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
export default ProfileView;
