'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Star, Clock, Heart, ExternalLink } from 'lucide-react';
import { UnifiedContent } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { toggleFavorite, selectIsFavorite } from '@/features/favorites/favoritesSlice';
import Button from '../ui/Button';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: UnifiedContent | null;
}

export function QuickViewModal({ isOpen, onClose, content }: QuickViewModalProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
    content ? selectIsFavorite(state, content.id) : false
  );

  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card/90 text-foreground glass shadow-2xl z-10 flex flex-col max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header Image */}
            {content.image && (
              <div className="relative h-60 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.image}
                  alt={content.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/95 text-primary-foreground shadow-sm">
                    {content.category}
                  </span>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {content.source}
                </span>
                <h2 className="text-xl md:text-2xl font-bold mt-1 leading-snug">
                  {content.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-2">
                  Published: {new Date(content.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Movie Details (Conditional) */}
              {content.type === 'movie' && content.extraInfo && (
                <div className="flex flex-wrap items-center gap-4 py-2 border-y border-border/60">
                  {content.extraInfo.rating !== undefined && (
                    <div className="flex items-center text-amber-500 font-semibold text-sm">
                      <Star className="h-4 w-4 fill-amber-500 mr-1" />
                      {content.extraInfo.rating.toFixed(1)} / 10
                    </div>
                  )}
                  {content.extraInfo.releaseDate && (
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {content.extraInfo.releaseDate}
                    </div>
                  )}
                  {content.extraInfo.duration && (
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {content.extraInfo.duration}
                    </div>
                  )}
                </div>
              )}

              {/* Social Details (Conditional) */}
              {content.type === 'social' && content.extraInfo && (
                <div className="flex flex-wrap items-center gap-4 py-2 border-y border-border/60 text-xs font-semibold text-muted-foreground">
                  <div>Likes: {content.extraInfo.likes}</div>
                  <div>Shares: {content.extraInfo.shares}</div>
                  <div>Comments: {content.extraInfo.commentsCount}</div>
                </div>
              )}

              {/* Description */}
              <div className="text-sm md:text-base text-foreground/80 leading-relaxed whitespace-pre-line">
                {content.description}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-muted/30 border-t border-border flex items-center justify-between gap-4">
              <Button
                variant={isFavorite ? 'outline' : 'glass'}
                onClick={() => dispatch(toggleFavorite(content))}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} />
                {isFavorite ? 'Remove Bookmark' : 'Bookmark'}
              </Button>

              {content.url && content.url !== '#' && (
                <a
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="primary" className="flex items-center gap-2">
                    Source Link
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export default QuickViewModal;
