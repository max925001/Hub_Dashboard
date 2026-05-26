import favoritesReducer, {
  addFavorite,
  removeFavorite,
  toggleFavorite
} from '@/features/favorites/favoritesSlice';
import preferencesReducer, {
  setTheme,
  setLanguage,
  setDashboardLayout
} from '@/features/preferences/preferencesSlice';
import { UnifiedContent } from '@/types/content';

const mockItem: UnifiedContent = {
  id: 'news-1',
  type: 'news',
  title: 'Test News',
  description: 'Test Desc',
  image: '',
  source: 'Test Source',
  category: 'technology',
  url: '#',
  createdAt: new Date().toISOString(),
};

describe('favoritesSlice', () => {
  it('should return the initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual({ items: [] });
  });

  it('should handle addFavorite', () => {
    const nextState = favoritesReducer({ items: [] }, addFavorite(mockItem));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].id).toBe('news-1');
  });

  it('should not add duplicate favorites', () => {
    const state = { items: [mockItem] };
    const nextState = favoritesReducer(state, addFavorite(mockItem));
    expect(nextState.items).toHaveLength(1);
  });

  it('should handle removeFavorite', () => {
    const state = { items: [mockItem] };
    const nextState = favoritesReducer(state, removeFavorite('news-1'));
    expect(nextState.items).toHaveLength(0);
  });

  it('should handle toggleFavorite (remove when exists)', () => {
    const state = { items: [mockItem] };
    const nextState = favoritesReducer(state, toggleFavorite(mockItem));
    expect(nextState.items).toHaveLength(0);
  });

  it('should handle toggleFavorite (add when does not exist)', () => {
    const nextState = favoritesReducer({ items: [] }, toggleFavorite(mockItem));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].id).toBe('news-1');
  });
});

describe('preferencesSlice', () => {
  it('should handle setTheme', () => {
    const state = preferencesReducer(undefined, setTheme('light'));
    expect(state.theme).toBe('light');
  });

  it('should handle setLanguage', () => {
    const state = preferencesReducer(undefined, setLanguage('hi'));
    expect(state.language).toBe('hi');
  });

  it('should handle setDashboardLayout', () => {
    const customLayout = ['social', 'movie', 'news'];
    const state = preferencesReducer(undefined, setDashboardLayout(customLayout));
    expect(state.dashboardLayout).toEqual(customLayout);
  });
});
