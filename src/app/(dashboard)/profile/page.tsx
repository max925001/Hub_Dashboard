import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import MainLayout from '@/components/dashboard/MainLayout';
import ProfileView from '@/components/dashboard/ProfileView';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <MainLayout>
      <ProfileView />
    </MainLayout>
  );
}
