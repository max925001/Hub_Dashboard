import { NextResponse } from 'next/server';
import { MOCK_SOCIAL } from '@/constants/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');

  let filteredSocial = [...MOCK_SOCIAL];

  if (category && category !== 'all') {
    filteredSocial = filteredSocial.filter(
      (post) => post.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (query) {
    const searchLow = query.toLowerCase();
    filteredSocial = filteredSocial.filter(
      (post) =>
        post.content.toLowerCase().includes(searchLow) ||
        post.user.name.toLowerCase().includes(searchLow)
    );
  }

  return NextResponse.json({ posts: filteredSocial });
}
