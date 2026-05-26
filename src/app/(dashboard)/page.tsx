import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import MainLayout from '@/components/dashboard/MainLayout';
import UnifiedFeedList from '@/components/feed/UnifiedFeedList';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <MainLayout>
      <UnifiedFeedList />
    </MainLayout>
  );
}
