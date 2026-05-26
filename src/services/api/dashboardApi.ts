import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UnifiedContent } from '@/types/content';
import { normalizeNews, normalizeMovie, normalizeSocial } from '../adapters/contentNormalizer';

interface NewsResponse {
  articles: any[];
}

interface MoviesResponse {
  results: any[];
}

interface SocialResponse {
  posts: any[];
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getNews: builder.query<UnifiedContent[], { category?: string; q?: string }>({
      query: ({ category, q }) => {
        let url = 'news';
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (q) params.append('q', q);
        const searchStr = params.toString();
        return searchStr ? `${url}?${searchStr}` : url;
      },
      transformResponse: (response: NewsResponse, meta, arg) => {
        const categoryVal = arg?.category || 'general';
        return (response.articles || []).map((art, idx) => normalizeNews({ ...art, category: categoryVal }, idx));
      },
    }),
    getMovies: builder.query<UnifiedContent[], { q?: string }>({
      query: ({ q }) => {
        let url = 'movies';
        if (q) {
          url += `?q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      transformResponse: (response: MoviesResponse) => {
        return (response.results || []).map((movie) => normalizeMovie(movie));
      },
    }),
    getSocial: builder.query<UnifiedContent[], { category?: string; q?: string }>({
      query: ({ category, q }) => {
        let url = 'social';
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (q) params.append('q', q);
        const searchStr = params.toString();
        return searchStr ? `${url}?${searchStr}` : url;
      },
      transformResponse: (response: SocialResponse) => {
        return (response.posts || []).map((post) => normalizeSocial(post));
      },
    }),
  }),
});

export const { useGetNewsQuery, useGetMoviesQuery, useGetSocialQuery } = dashboardApi;
export default dashboardApi;
