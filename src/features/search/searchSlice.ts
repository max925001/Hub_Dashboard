import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
}

const initialState: SearchState = {
  query: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearSearchQuery(state) {
      state.query = '';
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
export const selectSearchQuery = (state: { search: SearchState }) => state.search.query;
export const selectSearchState = (state: { search: SearchState }) => state.search;
export const selectSearchText = (state: { search: SearchState }) => state.search.query;
export const setSearchText = setSearchQuery;
