'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/AppShell';
import { CUnitMascot } from '@/components/CUnitMascot';
import { AIScoreCard } from '@/components/AIScoreCard';
import { AuthModals } from '@/components/AuthModals';
import { formatCurrency } from '@/utils/formatCurrency';
import type { ProductType, CUnitState } from '@/components/types';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
 

interface OnboardingData {
  type: ProductType;
  amount: number;
  income: number;
  expenses: number;
  existingLoans: Array<{ id: string; name: string; monthlyPayment: number }>;
  totalMonthlyPayments: number;
}

interface AIResultsProps {
  onboardingData: OnboardingData;
  creditScore: number;
  debtToIncomeRatio: number;
  isAuthenticated: boolean;
}


export default function AIResultsPage({
  onboardingData,
  creditScore,
  debtToIncomeRatio,
  isAuthenticated
}: AIResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mascotState, setMascotState] = useState<CUnitState>('approve');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const isValidProductType = (value: string | null): value is ProductType => {
    return value === 'card' || value === 'loan' || value === 'microloan';
  };

  const getExplanation = () => {
    const factors: string[] = [];
    if (onboardingData.income >= 50000) factors.push('Стабильный доход');
    if (onboardingData.income >= 100000) factors.push('Высокий уровень дохода');
    if (debtToIncomeRatio < 30) factors.push('Низкая долговая нагрузка');
    if (onboardingData.existingLoans.length === 0) factors.push('Нет текущих обязательств');
    if (onboardingData.amount <= onboardingData.income * 12) factors.push('Адекватная запрашиваемая сумма');
    return factors.length > 0 ? factors : ['Анализ вашего профиля'];
  };

  const getSuggestions = () => {
    const suggestions: string[] = [];
    if (debtToIncomeRatio >= 40) suggestions.push('Снизьте долговую нагрузку перед новой заявкой');
    if (onboardingData.amount > onboardingData.income * 24) suggestions.push('Рассмотрите меньшую сумму для повышения шансов');
    if (onboardingData.income < 50000) suggestions.push('Подтвердите дополнительные источники дохода');
    if (suggestions.length === 0) suggestions.push('У вас хороший профиль для получения кредита');
    return suggestions;
  };


  const amount = Number(searchParams.get('amount')) || 0;
  const income = Number(searchParams.get('income')) || 0;
  const rawType = searchParams.get('type');
  const type: ProductType = isValidProductType(rawType) ? rawType : 'loan';
  const expenses = Number(searchParams.get('expenses')) || 40000;
  const totalMonthlyPayments = Number(searchParams.get('totalMonthlyPayments')) || 0;

  const productTypeLabels: Record<ProductType, string> = {
    card: 'Кредитная карта',
    loan: 'Кредит наличными',
    microloan: 'Микрозайм',
  };

  const handleContinue = () => {
    router.push(`/personal-offers?${searchParams.toString()}`);
  };

  const handleAuthSuccess = async(registered: boolean) => {
    setMascotState('celebrate');
    setShowAuthModal(false);

    if (registered && user) {
      try {
        await fetch('/api/users/me', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
            monthly_income: onboardingData.income,
            monthly_expenses: onboardingData.expenses,
            total_monthly_payments: onboardingData.totalMonthlyPayments
          })
        });
      } catch (e) {
        console.error("Не удалось сохранить данные в профиль", e);
      }
    }  
  };

  

  return (
    <AppShell hideFooter>
      <div className="container max-w-4xl py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <CUnitMascot state={mascotState} size={100} className="mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Анализ завершён!
          </h1>
          <p className="text-muted-foreground">
            C-Unit оценил ваш профиль и готов показать лучшие предложения
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* AI Score Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AIScoreCard
              score={creditScore ?? 70}
              explanation={getExplanation()}
              suggestions={getSuggestions()}
            />
          </motion.div>

          {/* User Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Ваш профиль
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Тип продукта</span>
                  <span className="font-medium">{productTypeLabels[onboardingData.type]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Желаемая сумма</span>
                  <span className="font-medium">{formatCurrency(onboardingData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ежемесячный доход</span>
                  <span className="font-medium">{formatCurrency(onboardingData.income)}</span>
                </div>
                {onboardingData.existingLoans.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Текущие кредиты</span>
                      <span className="font-medium">{onboardingData.existingLoans.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Платежи по кредитам</span>
                      <span className="font-medium">{formatCurrency(onboardingData.totalMonthlyPayments)}/мес</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Долговая нагрузка</span>
                      <span className={`font-medium ${debtToIncomeRatio >= 40 ? 'text-destructive' : debtToIncomeRatio >= 30 ? 'text-primary' : 'text-accent'}`}>
                        {debtToIncomeRatio.toFixed(1)}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Registration Offer */}
            {!isAuthenticated ? 
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-xl bg-primary/5 border border-primary/20"
            >
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Сохраните результат
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Зарегистрируйтесь, чтобы сохранить результаты анализа и получать персональные предложения
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAuthModal(true)}
              >
                Зарегистрироваться
              </Button>
            </motion.div>
            : ''}
          </motion.div>
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button size="lg" onClick={handleContinue} className="gap-2">
            Смотреть предложения
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            {(creditScore ?? 70) >= 70 
              ? `Найдено много подходящих предложений для вашего профиля`
              : `Мы подобрали предложения с учётом вашего профиля`
            }
          </p>
        </motion.div>

        {/* Auth Modal */}
        <AuthModals
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          defaultMode="register"
        />
      </div>
    </AppShell>
  );
}
