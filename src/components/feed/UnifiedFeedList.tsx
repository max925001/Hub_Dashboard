'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialQuery
} from '@/services/api/dashboardApi';
import { useAppSelector, useAppDispatch } from '@/hooks/store';
import { selectSearchQuery } from '@/features/search/searchSlice';
import { selectPreferences, setDashboardLayout } from '@/features/preferences/preferencesSlice';
import { UnifiedContent } from '@/types/content';
import { UnifiedFeedCard } from '../cards/UnifiedFeedCard';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { AlertCircle, RotateCcw, LayoutGrid, LayoutList } from 'lucide-react';
import Button from '../ui/Button';
import QuickViewModal from '../modals/QuickViewModal';

export function UnifiedFeedList() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const preferences = useAppSelector(selectPreferences);

  // Active category filter state (starts at 'all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Unified list of cards currently visible
  const [feedItems, setFeedItems] = useState<UnifiedContent[]>([]);
  // Page size for pagination / infinite scroll
  const [visibleCount, setVisibleCount] = useState(6);
  // Modal State
  const [selectedItem, setSelectedItem] = useState<UnifiedContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch queries
  const {
    data: newsData,
    isLoading: newsLoading,
    isFetching: newsFetching,
    error: newsError,
    refetch: refetchNews
  } = useGetNewsQuery({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    q: searchQuery || undefined
  });

  const {
    data: moviesData,
    isLoading: moviesLoading,
    isFetching: moviesFetching,
    error: moviesError,
    refetch: refetchMovies
  } = useGetMoviesQuery({
    q: searchQuery || undefined
  });

  const {
    data: socialData,
    isLoading: socialLoading,
    isFetching: socialFetching,
    error: socialError,
    refetch: refetchSocial
  } = useGetSocialQuery({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    q: searchQuery || undefined
  });

  // Re-fetch all datasets
  const handleRetryAll = () => {
    refetchNews();
    refetchMovies();
    refetchSocial();
  };

  // Interleave and personalize content
  const processedItems = useMemo(() => {
    const news = newsData || [];
    const movies = moviesData || [];
    const social = socialData || [];

    // Interleave the feeds (e.g. news, social, movie, news...)
    const maxLength = Math.max(news.length, movies.length, social.length);
    const combined: UnifiedContent[] = [];

    for (let i = 0; i < maxLength; i++) {
      if (news[i]) combined.push(news[i]);
      if (social[i]) combined.push(social[i]);
      // Interleave movies less frequently to prevent overwhelming
      if (movies[i] && i % 2 === 0) combined.push(movies[i]);
    }

    // Apply personalization boost: if a card's category matches favoriteCategories, push it higher
    const favoriteCats = preferences.favoriteCategories.map((c) => c.toLowerCase());
    
    return combined.sort((a, b) => {
      const aIsFav = favoriteCats.includes(a.category.toLowerCase()) ? 1 : 0;
      const bIsFav = favoriteCats.includes(b.category.toLowerCase()) ? 1 : 0;
      
      if (aIsFav !== bIsFav) {
        return bIsFav - aIsFav; // Favorites first
      }
      
      // Fallback to date sorting
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [newsData, moviesData, socialData, preferences.favoriteCategories]);

  // Synchronize incoming data into feed items
  useEffect(() => {
    setFeedItems(processedItems);
  }, [processedItems]);

  // Handle incoming live social posts from SSE hook
  const handleNewSocialPost = useCallback((post: UnifiedContent) => {
    setFeedItems((prevItems) => {
      // Check if duplicate
      if (prevItems.some((item) => item.id === post.id)) return prevItems;
      
      // Check category filters
      if (selectedCategory !== 'all' && post.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return prevItems;
      }
      // Check search filters
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!post.description.toLowerCase().includes(query) && !post.title.toLowerCase().includes(query)) {
          return prevItems;
        }
      }

      // Add to front of the feed items
      return [post, ...prevItems];
    });
  }, [selectedCategory, searchQuery]);

  // Subscribe to real-time events via hook
  useRealTimeUpdates({ onNewSocialPost: handleNewSocialPost });

  // Move card handler (React DnD drag & drop swapping)
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setFeedItems((prevItems) => {
      const updated = [...prevItems];
      const [draggedItem] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, draggedItem);

      // Persist reordered state layout into Redux
      const layoutIds = updated.slice(0, 15).map(item => item.id);
      dispatch(setDashboardLayout(layoutIds));

      return updated;
    });
  }, [dispatch]);

  // Infinite Scroll Intersection Observer
  const observerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && feedItems.length > visibleCount) {
          setVisibleCount((prev) => Math.min(prev + 6, feedItems.length));
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [feedItems.length, visibleCount]);

  const handleOpenDetails = (item: UnifiedContent) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Status checks
  const isGlobalLoading = newsLoading || moviesLoading || socialLoading;
  const isGlobalFetching = newsFetching || moviesFetching || socialFetching;
  const hasGlobalError = newsError || moviesError || socialError;

  return (
    <div className="space-y-6">
      {/* Category Tabs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('dashboard.title')}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t('dashboard.reorderTip')}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {['all', 'technology', 'science', 'entertainment', 'business', 'sports', 'health'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(6); // reset pagination count
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {t(`categories.${cat}`, cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Main content feeds */}
      {isGlobalLoading ? (
        // Grid Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-80 w-full rounded-2xl bg-card border border-border/80 glass flex flex-col p-5 space-y-4 animate-pulse">
              <div className="h-40 w-full rounded-xl bg-muted/60" />
              <div className="h-6 w-3/4 rounded bg-muted/60" />
              <div className="h-4 w-5/6 rounded bg-muted/60" />
              <div className="h-4 w-1/2 rounded bg-muted/60" />
            </div>
          ))}
        </div>
      ) : hasGlobalError ? (
        // Error Boundary fallback
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/50 glass max-w-lg mx-auto space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h3 className="font-bold text-lg text-foreground">Failed to fetch content feeds</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            There was a network failure connecting to the content API endpoints. Please try again.
          </p>
          <Button variant="primary" onClick={handleRetryAll} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      ) : feedItems.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-dashed border-border bg-card/50 glass max-w-md mx-auto space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            {t('dashboard.noResults')}
          </p>
        </div>
      ) : (
        // Feed Grid
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedItems.slice(0, visibleCount).map((item, idx) => (
              <UnifiedFeedCard
                key={item.id}
                item={item}
                index={idx}
                moveCard={moveCard}
                onOpenDetails={handleOpenDetails}
                compact={preferences.compactMode}
              />
            ))}
          </div>

          {/* Loader Element / Observer */}
          <div ref={observerRef} className="h-10 flex items-center justify-center pt-4">
            {isGlobalFetching && (
              <p className="text-xs font-semibold text-primary animate-pulse-slow">
                {t('dashboard.loading')}
              </p>
            )}
          </div>
        </>
      )}

      {/* Details View Modal */}
      <QuickViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={selectedItem}
      />
    </div>
  );
}
export default UnifiedFeedList;
