import { Metadata } from 'next'
import Home from '@/components/pages/Home'
import api from '@/services/api';

export const metadata: Metadata = {
  title: 'Credium — подбор кредитов, микрозаймов и кредитных карт онлайн',
  description: 'Умный сервис подбора кредитов с AI-анализом C-Unit. Сравните лучшие займы под 0%, кредитные карты с кэшбэком и потребительские кредиты. Одобрение онлайн за 2 минуты без справок.',
  
  openGraph: {
    title: 'Credium — быстрый AI-подбор кредитов и карт',
    description: 'Умный сервис подбора кредитных продуктов с AI-анализом. Решение за 2 минуты!',
    type: 'website',
    url: 'https://credium.store',
    locale: 'ru_RU',
    siteName: 'Credium',
    images: [
      {
        url: 'https://credium.store/og-main.png',
        width: 1200,
        height: 630,
        alt: 'Credium — AI-подбор кредитов',
        type: 'image/png',
      },
      {
        url: 'https://credium.store/og-main.jpg',
        width: 1200,
        height: 630,
        alt: 'Credium — AI-подбор кредитов',
        type: 'image/jpeg',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Credium — AI-подбор кредитов',
    description: 'Узнай свою вероятность одобрения с помощью C-Unit',
    creator: '@credium',
    site: '@credium',
    images: ['https://credium.store/og-main.png'],
  },
  
  // robots.txt правила для главной
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Ключевые слова
  keywords: [
    'кредиты онлайн', 
    'микрозаймы', 
    'кредитные карты', 
    'подбор кредита', 
    'одобрение кредита', 
    'кредит наличными', 
    'кредит без справок', 
    'кредит с плохой кредитной историей',
    'AI кредитный скоринг',
    'кредитный калькулятор'
  ],
  
  // Дополнительные мета-теги
  authors: [{ name: 'Credium', url: 'https://credium.store' }],
  creator: 'Credium',
  publisher: 'Credium',
  
  // Структурированные данные JSON-LD
  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Credium",
      "url": "https://credium.store",
      "description": "Умный сервис подбора кредитных продуктов с AI-анализом",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "RUB"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250"
      },
      "logo": "https://credium.store/logo.png",
      "screenshot": "https://credium.store/screenshot.png",
      "featureList": [
        "AI-анализ кредитной истории",
        "Подбор лучших предложений",
        "Оценка вероятности одобрения",
        "Сравнение условий банков"
      ]
    })
  }
}

export default async function HomePage() {
  let top10Data = null;
  try {
    top10Data = await api.getTop10();
  } catch (error) {
    console.error('Ошибка загрузки топ-10:', error);
    top10Data = null;
  }

  return <Home initialTop10Data={top10Data} />
}