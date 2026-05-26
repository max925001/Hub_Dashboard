import { UserPreferences } from '@/types/content';

export const CATEGORIES = [
  'technology',
  'science',
  'entertainment',
  'business',
  'sports',
  'politics',
  'health'
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' }
] as const;

export const DEFAULT_LAYOUT = ['news', 'movie', 'social'];

export const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteCategories: ['technology', 'entertainment', 'science'],
  interests: ['ai', 'movies', 'gadgets'],
  preferredContentSources: ['NewsAPI', 'TMDB', 'MockSocial'],
  language: 'en',
  theme: 'dark',
  dashboardLayout: DEFAULT_LAYOUT,
  compactMode: false,
};
