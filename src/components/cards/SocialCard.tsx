'use client';

import React, { useState } from 'react';
import { Bookmark, Heart, MessageCircle, Share2, ArrowRight } from 'lucide-react';
import { UnifiedContent } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { toggleFavorite, selectIsFavorite } from '@/features/favorites/favoritesSlice';
import { useTranslation } from 'react-i18next';

interface SocialCardProps {
  item: UnifiedContent;
  onOpenDetails: (item: UnifiedContent) => void;
  compact?: boolean;
}

export function SocialCard({ item, onOpenDetails, compact = false }: SocialCardProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, item.id));

  // Local state for interactive, simulated liking
  const [likesCount, setLikesCount] = useState(item.extraInfo?.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate share action
    navigator.clipboard.writeText(item.description);
    alert('Post text copied to clipboard!');
  };

  const author = item.extraInfo?.author || 'Anonymous User';
  const avatarText = author.substring(0, 2).toUpperCase();

  const formattedTime = (() => {
    const diffMs = Date.now() - new Date(item.createdAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(item.createdAt).toLocaleDateString();
  })();

  if (compact) {
    return (
      <div 
        onClick={() => onOpenDetails(item)}
        className="flex items-center space-x-4 p-3 rounded-xl hover:bg-muted/40 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/30"
      >
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs flex-shrink-0">
          {avatarText}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
            {author}
          </span>
          <p className="text-xs text-foreground truncate mt-0.5">
            {item.description}
          </p>
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
    <div className="flex flex-col h-full bg-card/45 border border-border/80 rounded-2xl p-5 glass hover:shadow-xl hover:border-primary/20 transition-all duration-300 group justify-between">
      <div className="space-y-4">
        {/* User Info Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-bold text-sm border border-indigo-500/25">
              {avatarText}
            </div>
            <div>
              <div className="text-sm font-bold text-foreground leading-tight">
                {author}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {formattedTime} • <span className="text-primary font-semibold lowercase">{t(`categories.${item.category}`, item.category)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFavoriteClick}
            className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-rose-500 transition-all"
            aria-label="Bookmark post"
          >
            <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Post Text */}
        <div 
          onClick={() => onOpenDetails(item)}
          className="text-sm text-foreground/80 leading-relaxed line-clamp-4 cursor-pointer hover:text-foreground transition-colors"
        >
          {item.description}
        </div>
      </div>

      {/* Engagement Actions */}
      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Like */}
          <button
            onClick={handleLikeClick}
            className={`flex items-center text-xs font-semibold space-x-1.5 transition-colors cursor-pointer ${
              hasLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${hasLiked ? 'fill-rose-500' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => onOpenDetails(item)}
            className="flex items-center text-xs font-semibold text-muted-foreground hover:text-primary space-x-1.5 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{item.extraInfo?.commentsCount || 0}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShareClick}
            className="flex items-center text-xs font-semibold text-muted-foreground hover:text-secondary space-x-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>{item.extraInfo?.shares || 0}</span>
          </button>
        </div>

        <button
          onClick={() => onOpenDetails(item)}
          className="text-xs font-bold text-primary hover:text-indigo-400 flex items-center gap-1 group/btn"
        >
          View Comments
          <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
export default SocialCard;
