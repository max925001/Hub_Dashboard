import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences } from '@/types/content';
import { DEFAULT_PREFERENCES } from '@/constants';

const initialState: UserPreferences = DEFAULT_PREFERENCES;

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    setLanguage(state, action: PayloadAction<'en' | 'hi'>) {
      state.language = action.payload;
    },
    setFavoriteCategories(state, action: PayloadAction<string[]>) {
      state.favoriteCategories = action.payload;
    },
    setInterests(state, action: PayloadAction<string[]>) {
      state.interests = action.payload;
    },
    setDashboardLayout(state, action: PayloadAction<string[]>) {
      state.dashboardLayout = action.payload;
    },
    toggleCompactMode(state) {
      state.compactMode = !state.compactMode;
    },
    updatePreferences(state, action: PayloadAction<Partial<UserPreferences>>) {
      return { ...state, ...action.payload };
    },
    resetPreferences() {
      return { ...DEFAULT_PREFERENCES };
    }
  }
});

export const {
  setTheme,
  setLanguage,
  setFavoriteCategories,
  setInterests,
  setDashboardLayout,
  toggleCompactMode,
  updatePreferences,
  resetPreferences
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
export const selectPreferences = (state: { preferences: UserPreferences }) => state.preferences;
export const selectTheme = (state: { preferences: UserPreferences }) => state.preferences.theme;
export const selectLanguage = (state: { preferences: UserPreferences }) => state.preferences.language;
export const selectDashboardLayout = (state: { preferences: UserPreferences }) => state.preferences.dashboardLayout;
export const selectFavoriteCategories = (state: { preferences: UserPreferences }) => state.preferences.favoriteCategories;
