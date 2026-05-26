'use client';

import React from 'react';
import { Bookmark, Star, Calendar, Clock, ArrowRight } from 'lucide-react';
import { UnifiedContent } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { toggleFavorite, selectIsFavorite } from '@/features/favorites/favoritesSlice';
import { useTranslation } from 'react-i18next';

interface MovieCardProps {
  item: UnifiedContent;
  onOpenDetails: (item: UnifiedContent) => void;
  compact?: boolean;
}

export function MovieCard({ item, onOpenDetails, compact = false }: MovieCardProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, item.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  const rating = item.extraInfo?.rating;
  const duration = item.extraInfo?.duration;
  const releaseYear = item.extraInfo?.releaseDate
    ? new Date(item.extraInfo.releaseDate).getFullYear()
    : 'N/A';

  if (compact) {
    return (
      <div 
        onClick={() => onOpenDetails(item)}
        className="flex items-center space-x-4 p-3 rounded-xl hover:bg-muted/40 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/30"
      >
        <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
            Movie ({releaseYear})
          </span>
          <h4 className="text-xs font-bold text-foreground truncate mt-0.5">
            {item.title}
          </h4>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-rose-500 transition-all"
        >
          <Bookmark className={`h-4.5 w-4.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card/45 border border-border/80 rounded-2xl overflow-hidden glass hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
      {/* Poster */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Rating Badge */}
        {rating !== undefined && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold bg-amber-500 text-amber-950 flex items-center space-x-1 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-950" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          aria-label="Bookmark movie"
        >
          <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-white text-white' : ''}`} />
        </button>
      </div>

      {/* Details */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {releaseYear}
            </span>
            {duration && (
              <span className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {duration}
              </span>
            )}
          </div>
          <h3 className="font-bold text-base text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <button
            onClick={() => onOpenDetails(item)}
            className="text-xs font-semibold text-foreground hover:text-primary flex items-center gap-1 group/btn"
          >
            {t('dashboard.viewMovie')}
            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default MovieCard;
