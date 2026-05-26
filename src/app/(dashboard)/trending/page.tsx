import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import MainLayout from '@/components/dashboard/MainLayout';
import TrendingList from '@/components/dashboard/TrendingList';

export default async function TrendingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <MainLayout>
      <TrendingList />
    </MainLayout>
  );
}
