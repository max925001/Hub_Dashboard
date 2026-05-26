import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import MainLayout from '@/components/dashboard/MainLayout';
import FavoritesList from '@/components/dashboard/FavoritesList';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <MainLayout>
      <FavoritesList />
    </MainLayout>
  );
}
