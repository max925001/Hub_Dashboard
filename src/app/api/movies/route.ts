import { NextResponse } from 'next/server';
import { MOCK_MOVIES } from '@/constants/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (apiKey) {
    try {
      let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
      
      if (query) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
      }

      const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
      if (response.ok) {
        const data = await response.json();
        if (data.results) {
          return NextResponse.json({ results: data.results });
        }
      }
    } catch (error) {
      console.error('Failed to fetch from TMDB, falling back to mock:', error);
    }
  }

  // Fallback to Mock Movies
  let filteredMovies = [...MOCK_MOVIES];

  if (query) {
    const searchLow = query.toLowerCase();
    filteredMovies = filteredMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchLow) ||
        movie.overview.toLowerCase().includes(searchLow)
    );
  }

  return NextResponse.json({ results: filteredMovies });
}
