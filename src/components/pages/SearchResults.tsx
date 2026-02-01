'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import { SearchBar } from '@/components/SearchBar';
import { ResultCard } from '@/components/ResultCard';
import { AIScoreCard } from '@/components/AIScoreCard';
import { EmptyState } from '@/components/EmptyState';
import { CUnitMascot } from '@/components/CUnitMascot';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearch } from '@/hooks/useCrediumAPI';
import type { SearchParams, CUnitState, SearchResponse } from '@/components/types';

interface SearchResultsProps {
  initialResults: SearchResponse | null;
}

export default function SearchResultsClient({ initialResults }: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchMutation = useSearch();

  const [mascotState, setMascotState] = useState<CUnitState>('idle');
  const [results, setResults] = useState<SearchResponse | null>(initialResults);
  const isFirstRender = useRef(true);

  const handleSearch = async (params: SearchParams) => {
    setMascotState('scanning');

    const paramsUrl = new URLSearchParams();
    if (params.amount) paramsUrl.set('amount', params.amount.toString());
    if (params.term) paramsUrl.set('term', params.term.toString());
    if (params.type) paramsUrl.set('type', params.type);

    router.replace(`/search?${paramsUrl.toString()}`, { scroll: false });

    try {
      const data = await searchMutation.mutateAsync(params);

      const sortedResults = [...data.results].sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
    
      setResults({...data, results: sortedResults });
      setMascotState('approve');
      setTimeout(() => setMascotState('idle'), 2000);
    } catch {
      setMascotState('warn');
    }
  };

  const isLoading = searchMutation.isPending;
  
  return (
    <AppShell>
      <div className="container py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Поиск продуктов</h1>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} expanded={false} />
        </div>

        {/* Results Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Results List */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : results && results.results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <CUnitMascot state={mascotState} size={40} />
                  <p className="text-muted-foreground">
                    Найдено <span className="font-medium text-foreground">{results.results.length}</span> предложений
                  </p>
                </div>
                {results.results.map((product, index) => (
                  <ResultCard
                    key={product.id}
                    product={product}
                    index={index}
                    onDetails={(id) => router.push(`/product/${id}`)}
                  />
                ))}
              </div>
            ) : results ? (
              <EmptyState
                type="no-results"
                onAction={() => setResults(null)}
              />
            ) : (
              <EmptyState
                type="initial"
                title="Введите параметры"
                description="Укажите желаемую сумму, срок и тип продукта для поиска"
              />
            )}
          </div>

          {/* Sidebar - AI Summary */}
          <div className="lg:col-span-1">
            {results?.aiSummary ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24"
              >
                <AIScoreCard
                  score={results.aiSummary.score}
                  explanation={results.aiSummary.explanation}
                  suggestions={results.aiSummary.suggestions}
                />
              </motion.div>
            ) : (
              <div className="p-6 rounded-xl bg-muted/50 border border-border text-center">
                <CUnitMascot state="idle" size={64} className="mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">
                  Начните поиск, и я проанализирую лучшие варианты для вас
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
