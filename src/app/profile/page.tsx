import { Metadata } from 'next';
import ProfileClient from '@/components/pages/Profile';

export const metadata: Metadata = {
  title: 'Личный кабинет | Credium',
  description: 'Управление профилем и настройки аккаунта.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}