export interface UnifiedContent {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description: string;
  image: string;
  source: string;
  category: string;
  url: string;
  createdAt: string;
  extraInfo?: {
    likes?: number;
    shares?: number;
    rating?: number; // For movies
    releaseDate?: string; // For movies
    duration?: string; // For movies/media
    commentsCount?: number; // For social posts
    author?: string; // For social posts or news
  };
}

export type FeedType = 'all' | 'news' | 'movie' | 'social';

export interface UserPreferences {
  favoriteCategories: string[];
  interests: string[];
  preferredContentSources: string[];
  language: 'en' | 'hi';
  theme: 'light' | 'dark';
  dashboardLayout: string[]; // Order of sections or cards
  compactMode: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'social' | 'movie';
  read: boolean;
  createdAt: string;
}

export interface SearchState {
  query: string;
  results: UnifiedContent[];
  loading: boolean;
  error: string | null;
}
