import {
  normalizeNews,
  normalizeMovie,
  normalizeSocial
} from '@/services/adapters/contentNormalizer';

describe('contentNormalizer adapters', () => {
  it('should normalize news articles correctly', () => {
    const rawArticle = {
      title: 'New JS Features',
      description: 'ES2026 specs released.',
      urlToImage: 'http://img.com',
      source: { name: 'TechNews' },
      publishedAt: '2026-05-26T20:00:00Z',
      author: 'John Resig',
      url: 'http://news.com',
    };

    const normalized = normalizeNews(rawArticle, 0);

    expect(normalized.type).toBe('news');
    expect(normalized.title).toBe('New JS Features');
    expect(normalized.source).toBe('TechNews');
    expect(normalized.image).toBe('http://img.com');
    expect(normalized.extraInfo?.author).toBe('John Resig');
    expect(normalized.createdAt).toBe('2026-05-26T20:00:00Z');
  });

  it('should fallback to default image if news urlToImage is missing', () => {
    const rawArticle = { title: 'No Image Article' };
    const normalized = normalizeNews(rawArticle, 0);
    expect(normalized.image).toContain('images.unsplash.com');
  });

  it('should normalize movies correctly', () => {
    const rawMovie = {
      id: 999,
      title: 'The Great Matrix',
      overview: 'Neo returns in digital world.',
      poster_path: '/path.jpg',
      vote_average: 8.5,
      release_date: '2026-01-15',
    };

    const normalized = normalizeMovie(rawMovie);

    expect(normalized.id).toBe('movie-999');
    expect(normalized.type).toBe('movie');
    expect(normalized.title).toBe('The Great Matrix');
    expect(normalized.image).toBe('https://image.tmdb.org/t/p/w500/path.jpg');
    expect(normalized.extraInfo?.rating).toBe(8.5);
    expect(normalized.extraInfo?.releaseDate).toBe('2026-01-15');
  });

  it('should normalize social posts correctly', () => {
    const rawPost = {
      id: 'social-abc',
      user: { name: 'Alice' },
      content: 'Hello world!',
      category: 'health',
      likes: 50,
      shares: 10,
      commentsCount: 5,
      createdAt: '2026-05-26T20:30:00Z',
    };

    const normalized = normalizeSocial(rawPost);

    expect(normalized.id).toBe('social-social-abc');
    expect(normalized.type).toBe('social');
    expect(normalized.description).toBe('Hello world!');
    expect(normalized.extraInfo?.likes).toBe(50);
    expect(normalized.extraInfo?.author).toBe('Alice');
  });
});
