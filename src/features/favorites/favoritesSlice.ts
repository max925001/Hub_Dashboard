import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UnifiedContent } from '@/types/content';

interface FavoritesState {
  items: UnifiedContent[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<UnifiedContent>) {
      if (!state.items.find((item) => item.id === action.payload.id)) {
        state.items.unshift(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleFavorite(state, action: PayloadAction<UnifiedContent>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(action.payload);
      }
    },
    clearFavorites(state) {
      state.items = [];
    }
  }
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.items;
export const selectIsFavorite = (state: { favorites: FavoritesState }, id: string) =>
  state.favorites.items.some((item) => item.id === id);
