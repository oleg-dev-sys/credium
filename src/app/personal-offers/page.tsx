import { Metadata } from 'next';
import PersonalOffersClient from '@/components/pages/PersonalOffers';
import type { Product, ProductType, SearchParams } from '@/components/types';
import api from '@/services/api';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}): Promise<Metadata> {
  const params = await searchParams;
  const amount = searchParams.amount as string | undefined;
  
  return {
    title: amount 
      ? `Вам одобрено: кредиты на ${amount} ₽ — Персональная подборка`
      : 'Персональные предложения | Credium',
    description: 'Список банковских продуктов, подобранных специально под ваш профиль с вероятностью одобрения выше 80%.',
  };
}

interface PageProps {
  searchParams: Promise<{
    type?: string;
    amount?: string;
    // остальные параметры не нужны для поиска на сервере
  }>;
}

export default async function PersonalOffersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // Извлекаем параметры для поиска
  const amount = params.amount ? Number(params.amount) : 300000;
  const type = (params.type as ProductType) || 'loan';

  // Загружаем продукты на сервере
  let initialProducts: Product[] = [];
  try {
    const searchPayload: SearchParams = {
      amount,
      type,
      period: 12, // значение по умолчанию (если бэкенд требует)
      expenses: 0,
      totalMonthlyPayments: 0,
    };
    
    const response = await api.search(searchPayload);
    initialProducts = response.results;
  } catch (error) {
    console.error('Ошибка загрузки персональных предложений на сервере:', error);
    initialProducts = [];
  }

  return <PersonalOffersClient initialProducts={initialProducts} />;
}