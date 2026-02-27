import { Metadata } from 'next';
import { blogArticles } from '@/data/articles';
import BlogClient from '@/components/pages/BlogClient';

export const meta: Metadata = {
  title: 'Блог Credium — статьи о кредитах и финансах',
  description: 'Полезные статьи о повышении кредитного рейтинга, рефинансировании, микрозаймах и управлении личными финансами. Советы экспертов Credium.',
  openGraph: {
    title: 'Блог Credium',
    description: 'Читайте о финансах просто и понятно',
    type: 'website',
    url: 'https://credium.store/blog',
    locale: 'ru_RU',
    siteName: 'Credium',
    images: [
      {
        url: 'https://credium.store/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'Блог Credium',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    'блог о кредитах',
    'как улучшить кредитную историю',
    'финансовая грамотность',
    'рефинансирование',
    'кредитный рейтинг',
  ],
};

export default async function BlogPage() {
  // В будущем можно заменить на вызов API
  const articles = blogArticles;

  return <BlogClient initialArticles={articles} />;
}