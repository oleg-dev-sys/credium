import { Metadata } from 'next';
import AIResultsClient from '@/components/pages/AIResults';
import { Suspense } from 'react';
import api from '@/services/api';
import type { ProductType } from '@/components/types';
import { cookies } from 'next/headers';

// Валидация типа продукта
const isValidProductType = (value: string | null | undefined): value is ProductType => {
  return value === 'card' || value === 'loan' || value === 'microloan';
};

export const metadata: Metadata = {
  title: 'Результаты AI анализа | Credium',
  description: 'Оценка вашей кредитоспособности и персональные рекомендации.',
  robots: { index: false } // Обычно результаты скоринга не индексируют, это приватная инфа
};

interface PageProps {
  searchParams: Promise<{
    type?: string;
    amount?: string;
    income?: string;
    expenses?: string;
    totalMonthlyPayments?: string;
  }>;
}

export default async function AIResultsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // Парсим параметры из URL
  const amount = Number(params.amount) || 0;
  const income = Number(params.income) || 0;
  const type: ProductType = isValidProductType(params.type) ? params.type : 'loan';
  const expenses = Number(params.expenses) || 40000;
  const totalMonthlyPayments = Number(params.totalMonthlyPayments) || 0;

  // Рассчитываем долговую нагрузку
  const debtToIncomeRatio = income > 0 ? (totalMonthlyPayments / income) * 100 : 0;

  // Получаем токен из кук
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // Получаем данные пользователя и кредитный скор
  let creditScore: number | null = null;
  let isAuthenticated = false;

  try {
    if (token) {
      const user = await api.getMe(token);
      creditScore = user.credit_score ?? 60;
      isAuthenticated = true;
    } else {
      // Анонимный расчёт скоринга (простой алгоритм на сервере)
      const baseScore = 70;
      let score = baseScore;
      
      if (income >= 100000) score += 15;
      else if (income >= 50000) score += 10;
      
      if (debtToIncomeRatio < 30) score += 10;
      else if (debtToIncomeRatio < 40) score += 5;
      else if (debtToIncomeRatio >= 50) score -= 15;
      
      if (amount <= income * 12) score += 5;
      
      creditScore = Math.max(30, Math.min(95, score));
    }
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    creditScore = token ? 60 : 70;
  }
  
  // Формируем данные для клиента
  const onboardingData = {
    type,
    amount,
    income,
    expenses,
    existingLoans: [],
    totalMonthlyPayments,
  };

  return (
    <AIResultsClient
      onboardingData={onboardingData}
      creditScore={creditScore}
      debtToIncomeRatio={debtToIncomeRatio}
      isAuthenticated={isAuthenticated}
    />
  );
}