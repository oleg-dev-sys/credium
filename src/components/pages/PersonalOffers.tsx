'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Sparkles, X, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AppShell } from '@/components/AppShell';
import { ResultCard } from '@/components/ResultCard';
import { AIScoreCard } from '@/components/AIScoreCard';
import { CUnitMascot } from '@/components/CUnitMascot';
import { formatCurrency } from '@/utils/formatCurrency';
import type { ProductType, Product, CUnitState } from '@/components/types';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

const calculateSimpleScore = (amount: number, income: number): number => {
  const ratio = income > 0 ? (income * 12) / amount : 0;
  if (ratio >= 2) return 85;
  if (ratio >= 1.5) return 75;
  if (ratio >= 1) return 65;
  if (ratio >= 0.5) return 50;
  return 35;
};

interface PersonalOffersProps {
  initialProducts: Product[];
}

type SortOption = 'approval' | 'apr' | 'amount';


export default function PersonalOffersClient({ initialProducts }: PersonalOffersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mascotState] = useState<CUnitState>('idle');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuth();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const type = (searchParams.get('type') as ProductType) || 'loan';
  const amount = Number(searchParams.get('amount')) || 300000;
  const income = Number(searchParams.get('income')) || 80000;
  const expenses = Number(searchParams.get('expenses')) || 40000;
  const totalMonthlyPayments = Number(searchParams.get('totalMonthlyPayments')) || 0;

  const initialAmountRangeMin = Number(searchParams.get('minAmount')) || 0;
  const initialAmountRangeMax = Number(searchParams.get('maxAmount')) || 5000000;
  const initialAprRangeMin = Number(searchParams.get('minApr')) || 0;
  const initialAprRangeMax = Number(searchParams.get('maxApr')) || 100;
  const initialSortBy = (searchParams.get('sortBy') as SortOption) || 'approval';

  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [hasLoadedProducts, setHasLoadedProducts] = useState(false);

  const onboardingParams = useMemo(() => ({
    type,
    amount,
    income,
    expenses,
    totalMonthlyPayments,
  }), [type, amount, income, expenses, totalMonthlyPayments]);

  const [amountRange, setAmountRange] = useState<[number, number]>([
    initialAmountRangeMin,
    initialAmountRangeMax
  ]);

  const [aprRange, setAprRange] = useState<[number, number]>([
    initialAprRangeMin,
    initialAprRangeMax
  ]);

  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('type', type);
    params.set('amount', amount.toString());
    params.set('income', income.toString());
    params.set('expenses', expenses.toString());
    params.set('totalMonthlyPayments', totalMonthlyPayments.toString());

    params.set('minAmount', amountRange[0].toString());
    params.set('maxAmount', amountRange[1].toString());
    params.set('minApr', aprRange[0].toString());
    params.set('maxApr', aprRange[1].toString());
    params.set('sortBy', sortBy);

    router.replace(`/personal-offers?${params.toString()}`, { scroll: false });
  }, [amountRange, aprRange, sortBy, onboardingParams, router, searchParams]);
  
  const displayScore = useMemo(() => {
    if (user?.credit_score) return user.credit_score;
    return 70;
  }, [user]);

  const productsWithApproval = useMemo(() => {
    return allProducts.map(product => {
      const baseChance = calculateSimpleScore(onboardingParams.amount, onboardingParams.income);
      const debtRatio = onboardingParams.income > 0 ? (onboardingParams.totalMonthlyPayments / onboardingParams.income) * 100 : 0;
      const debtPenalty = Math.min(debtRatio * 0.5, 20);
      const approvalChance = Math.max(Math.round(baseChance - debtPenalty), 20);
      
      return {
        ...product,
        approvalChance,
        bankName: product.bank || 'Банк',
        isRecommended: approvalChance >= 70,
      };
    });
  }, [allProducts, onboardingParams]);

  const filteredProducts = useMemo(() => {
    let filtered = productsWithApproval.filter(p => {
      const maxAmount = p.max_amount || 0;
      const apr = p.apr || 0;
      return maxAmount >= amountRange[0] && maxAmount <= amountRange[1] &&
            apr >= aprRange[0] && apr <= aprRange[1];
    });

    switch (sortBy) {
      case 'approval': return filtered.sort((a, b) => (b.approvalChance || 0) - (a.approvalChance || 0));
      case 'apr': return filtered.sort((a, b) => (a.apr || 0) - (b.apr || 0));
      case 'amount': return filtered.sort((a, b) => (b.max_amount || 0) - (a.max_amount || 0));
      default: return filtered;
    }
  }, [productsWithApproval, amountRange, aprRange, sortBy]);

  const recommendedCount = filteredProducts.filter(p => p.isRecommended).length;

  const productTypeLabels: Record<ProductType, string> = {
    card: 'Кредитные карты',
    loan: 'Кредиты наличными',
    microloan: 'Микрозаймы',
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'approval', label: 'По шансу одобрения' },
    { value: 'apr', label: 'По ставке' },
    { value: 'amount', label: 'По сумме' },
  ];

  const resetFilters = () => {
    setAmountRange([0, 5000000]);
    setAprRange([0, 100]);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Amount Range */}
      <div>
        <div className="flex justify-between mb-2">
          <Label className="text-muted-foreground">Сумма</Label>
          <span className="text-sm font-medium">
            {formatCurrency(amountRange[0])} — {formatCurrency(amountRange[1])}
          </span>
        </div>
        <Slider
          value={amountRange}
          onValueChange={(v) => setAmountRange(v as [number, number])}
          min={0}
          max={5000000}
          step={50000}
        />
      </div>

      {/* APR Range */}
      <div>
        <div className="flex justify-between mb-2">
          <Label className="text-muted-foreground">Ставка, %</Label>
          <span className="text-sm font-medium">
            {aprRange[0]}% — {aprRange[1]}%
          </span>
        </div>
        <Slider
          value={aprRange}
          onValueChange={(v) => setAprRange(v as [number, number])}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <Button variant="outline" className="w-full" onClick={resetFilters}>
        <X className="w-4 h-4 mr-2" />
        Сбросить фильтры
      </Button>
    </div>
  );

  if (loading) {
    return (
      <AppShell>
        <div className="container py-8 text-center">Загрузка персональных предложений...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <CUnitMascot state={mascotState} size={50} />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Персональные предложения
              </h1>
              <p className="text-muted-foreground">
                {productTypeLabels[onboardingParams.type]} • Подобраны специально для вас
              </p>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm">
                <span className="font-medium text-foreground">{filteredProducts.length}</span>
                <span className="text-muted-foreground"> предложений</span>
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-sm">
              <span className="font-medium text-accent">{recommendedCount}</span>
              <span className="text-muted-foreground"> с высоким шансом одобрения</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-sm">
              <span className="text-muted-foreground">Ваш AI Score: </span>
              <span className="font-medium text-primary">{displayScore}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters (Desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Фильтры
                </h3>
                <FilterContent />
              </div>

              {/* AI Score Mini Card */}
              <AIScoreCard score={displayScore} compact className="p-4 rounded-xl bg-card border border-border" />
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort & Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Фильтры</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Buttons */}
              <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy(option.value)}
                    className="whitespace-nowrap"
                  >
                    {sortBy === option.value && <Check className="w-4 h-4 mr-1" />}
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products List */}
            {filteredProducts.length > 0 ? (
              <div className="space-y-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ResultCard
                      product={product}
                      index={index}
                      onDetails={(id) => router.push(`/product/${id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CUnitMascot state="confused" size={80} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Нет подходящих предложений
                </h3>
                <p className="text-muted-foreground mb-4">
                  Попробуйте изменить параметры фильтров
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
