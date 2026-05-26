import { NextResponse } from 'next/server';
import { MOCK_NEWS } from '@/constants/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (apiKey) {
    try {
      let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
      if (category && category !== 'all') {
        url += `&category=${category}`;
      }
      if (query) {
        url += `&q=${encodeURIComponent(query)}`;
      }

      const response = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 mins
      if (response.ok) {
        const data = await response.json();
        if (data.articles) {
          // Add category tag to articles for normalization
          const articles = data.articles.map((art: any) => ({
            ...art,
            category: category || 'general',
          }));
          return NextResponse.json({ articles });
        }
      }
    } catch (error) {
      console.error('Failed to fetch from NewsAPI, falling back to mock:', error);
    }
  }

  // Fallback / Mock Data Mode
  let filteredNews = [...MOCK_NEWS];

  if (category && category !== 'all') {
    filteredNews = filteredNews.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (query) {
    const searchLow = query.toLowerCase();
    filteredNews = filteredNews.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLow) ||
        item.description.toLowerCase().includes(searchLow)
    );
  }

  return NextResponse.json({ articles: filteredNews });
}
