'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialQuery
} from '@/services/api/dashboardApi';
import { UnifiedContent } from '@/types/content';
import { Flame, Star, Award, TrendingUp } from 'lucide-react';
import NewsCard from '../cards/NewsCard';
import MovieCard from '../cards/MovieCard';
import SocialCard from '../cards/SocialCard';
import QuickViewModal from '../modals/QuickViewModal';

type TrendingTab = 'all' | 'news' | 'movie' | 'social';

export function TrendingList() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TrendingTab>('all');
  const [selectedItem, setSelectedItem] = useState<UnifiedContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: news } = useGetNewsQuery({});
  const { data: movies } = useGetMoviesQuery({});
  const { data: social } = useGetSocialQuery({});

  const trendingItems = useMemo(() => {
    const trendingNews = (news || []).slice(0, 3); // Take top headlines
    
    // Sort movies by rating descending
    const trendingMovies = [...(movies || [])].sort((a, b) => {
      const aRating = a.extraInfo?.rating || 0;
      const bRating = b.extraInfo?.rating || 0;
      return bRating - aRating;
    });

    // Sort social by likes count descending
    const trendingSocial = [...(social || [])].sort((a, b) => {
      const aLikes = a.extraInfo?.likes || 0;
      const bLikes = b.extraInfo?.likes || 0;
      return bLikes - aLikes;
    });

    return {
      news: trendingNews,
      movie: trendingMovies,
      social: trendingSocial,
      all: [...trendingNews, ...trendingMovies, ...trendingSocial].sort((a, b) => {
        // Interleave them by sorting by rating/likes/relevance
        const scoreA = a.type === 'movie' ? (a.extraInfo?.rating || 0) : a.type === 'social' ? (a.extraInfo?.likes || 0) / 20 : 7;
        const scoreB = b.type === 'movie' ? (b.extraInfo?.rating || 0) : b.type === 'social' ? (b.extraInfo?.likes || 0) / 20 : 7;
        return scoreB - scoreA;
      })
    };
  }, [news, movies, social]);

  const handleOpenDetails = (item: UnifiedContent) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const list = trendingItems[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <Flame className="h-7 w-7 text-amber-500 fill-amber-500" />
          {t('dashboard.trendingTitle')}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Explore the highest rated movies, breaking headlines, and most liked community posts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(['all', 'news', 'movie', 'social'] as TrendingTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer capitalize ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'all' ? 'All Buzz' : tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {list.length === 0 ? (
        <div className="text-center p-12 text-sm text-muted-foreground">
          Gathering trending data...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <div key={item.id} className="relative">
              {/* Hot Ribbon decoration */}
              <div className="absolute -top-1.5 -left-1.5 z-10 bg-rose-500 text-white rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-md shadow-rose-500/20 flex items-center space-x-0.5">
                <TrendingUp className="h-3 w-3" />
                <span>HOT</span>
              </div>
              
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
export default TrendingList;
