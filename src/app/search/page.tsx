import { Metadata } from 'next';
import SearchResultsClient from '@/components/pages/SearchResults';
import api from '@/services/api';
import type { SearchParams, ProductType } from '@/components/types';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams;
  const amount = params.amount as string | undefined;
  
  return {
    title: amount 
      ? `Кредиты на сумму ${amount} руб. — Результаты поиска | Credium`
      : 'Поиск кредитов и займов | Credium',
    description: 'Подбор выгодных кредитных предложений с помощью AI. Сравните ставки и условия.',
    robots: {
      index: false,
      follow: true,
    },
  };
}

interface PageProps {
  searchParams: Promise<{
    amount?: string;
    term?: string;
    type?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const amount = params.amount ? Number(params.amount) : null;
  const term = params.term ? Number(params.term) : undefined;
  const type = params.type as ProductType | undefined;

  let initialResults = null;
  if (amount) {
    try {
      // Используем явное приведение типа
      const searchPayload = { 
        amount,
        ...(term && { term }),
        ...(type && { type })
      } as SearchParams;
      
      const response = await api.search(searchPayload);
      
      const sortedResults = [...response.results].sort(
        (a, b) => (b.ai_score || 0) - (a.ai_score || 0)
      );
      
      initialResults = {
        ...response,
        results: sortedResults
      };
    } catch (error) {
      console.error('Ошибка загрузки результатов поиска:', error);
      initialResults = null;
    }
  }

  return <SearchResultsClient initialResults={initialResults} />;
}