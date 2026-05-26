import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import MainLayout from '@/components/dashboard/MainLayout';
import SettingsForm from '@/components/dashboard/SettingsForm';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <MainLayout>
      <SettingsForm />
    </MainLayout>
  );
}
