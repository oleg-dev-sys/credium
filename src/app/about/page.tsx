import { Metadata } from 'next';
import AboutContent from '@/components/pages/About';

export const metadata: Metadata = {
  title: 'О сервисе Credium — AI-платформа для подбора кредитов',
  description: 'Credium — это умная платформа для подбора кредитных продуктов с помощью искусственного интеллекта.',
};

export default function AboutPage() {
  return <AboutContent />;
}