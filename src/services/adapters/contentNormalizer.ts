import { UnifiedContent } from '@/types/content';

export function normalizeNews(article: any, index: number): UnifiedContent {
  const publishedDate = article.publishedAt || new Date().toISOString();
  return {
    id: `news-${article.source?.id || 'src'}-${index}-${encodeURIComponent(article.title || '')}`.substring(0, 100),
    type: 'news',
    title: article.title || 'Breaking News',
    description: article.description || article.content || 'No description available.',
    image: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600',
    source: article.source?.name || 'News Network',
    category: article.category || 'general',
    url: article.url || '#',
    createdAt: publishedDate,
    extraInfo: {
      author: article.author || 'Staff Writer',
    },
  };
}

export function normalizeMovie(movie: any): UnifiedContent {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600';

  return {
    id: `movie-${movie.id}`,
    type: 'movie',
    title: movie.title || movie.original_title || 'Unknown Title',
    description: movie.overview || 'No overview available.',
    image: imageUrl,
    source: 'TMDB',
    category: 'entertainment',
    url: movie.id ? `https://www.themoviedb.org/movie/${movie.id}` : '#',
    createdAt: movie.release_date ? new Date(movie.release_date).toISOString() : new Date().toISOString(),
    extraInfo: {
      rating: movie.vote_average || 0,
      releaseDate: movie.release_date || 'N/A',
      duration: movie.runtime ? `${movie.runtime}m` : undefined,
    },
  };
}

export function normalizeSocial(post: any): UnifiedContent {
  return {
    id: `social-${post.id}`,
    type: 'social',
    title: post.title || `${post.user?.name || 'Anonymous User'} posted`,
    description: post.content || post.text || '',
    image: post.image || '',
    source: 'Social Feed',
    category: post.category || 'social',
    url: '#',
    createdAt: post.createdAt || new Date().toISOString(),
    extraInfo: {
      likes: post.likes || 0,
      shares: post.shares || 0,
      commentsCount: post.commentsCount || 0,
      author: post.user?.name || 'Anonymous',
    },
  };
}
