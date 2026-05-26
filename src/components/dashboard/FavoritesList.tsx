'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/store';
import { selectFavorites } from '@/features/favorites/favoritesSlice';
import { Heart, BookOpen } from 'lucide-react';
import { UnifiedContent } from '@/types/content';
import NewsCard from '../cards/NewsCard';
import MovieCard from '../cards/MovieCard';
import SocialCard from '../cards/SocialCard';
import QuickViewModal from '../modals/QuickViewModal';

export function FavoritesList() {
  const { t } = useTranslation();
  const favorites = useAppSelector(selectFavorites);
  const [selectedItem, setSelectedItem] = useState<UnifiedContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (item: UnifiedContent) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <Heart className="h-7 w-7 text-rose-500 fill-rose-500 animate-pulse" />
          {t('dashboard.favoritesTitle')}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Your curated selection of articles, movie releases, and updates.
        </p>
      </div>

      {/* Grid List */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-dashed border-border bg-card/45 glass max-w-lg mx-auto space-y-4">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
            <BookOpen className="h-10 w-10" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Curate Your Dashboard</h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            {t('dashboard.favoritesEmpty')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div key={item.id}>
              {item.type === 'news' && (
                <NewsCard item={item} onOpenDetails={handleOpenDetails} />
              )}
              {item.type === 'movie' && (
                <MovieCard item={item} onOpenDetails={handleOpenDetails} />
              )}
              {item.type === 'social' && (
                <SocialCard item={item} onOpenDetails={handleOpenDetails} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      <QuickViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={selectedItem}
      />
    </div>
  );
}
export default FavoritesList;
