'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/AppShell';
import { SearchBar } from '@/components/SearchBar';
import { AIScoreCard } from '@/components/AIScoreCard';
import { CUnitMascot } from '@/components/CUnitMascot';
import { useTop10, useSearch } from '@/hooks/useCrediumAPI';
import type { SearchParams, CUnitState, Product } from '@/components/types';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Top10List = dynamic(
  () => import('@/components/Top10List'),
  { 
    loading: () => (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    ),
    ssr: false 
  }
);

interface HomeProps {
  initialTop10Data: Product[] | null;
}


export default function Home({ initialTop10Data }: HomeProps) {
  const searchMutation = useSearch();
  const [mascotState, setMascotState] = useState<CUnitState>('idle');
  const { isTelegram } = useTelegramAuth();
  const { user } = useAuth();
  const router = useRouter(); 

  const rightContent = !isTelegram ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative flex justify-center"
    >
      <div className="relative">
        {/* Floating elements */}
        <motion.div
          className="absolute -top-8 -left-8 w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TrendingUp className="w-8 h-8 text-primary" />
        </motion.div>

        <motion.div
          className="absolute -bottom-4 -right-8 w-16 h-16 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Shield className="w-6 h-6 text-accent" />
        </motion.div>

        {/* Main card */}
        <div className="p-8 rounded-2xl bg-card border border-border shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <CUnitMascot state={mascotState} size={64} />
            <div>
              <h3 className="font-semibold text-foreground">C-Unit</h3>
              <p className="text-sm text-muted-foreground">Ваш личный помощник</p>
            </div>
          </div>

          <AIScoreCard
            score={user?.credit_score ?? 78}
            explanation={['Низкая кредитная нагрузка', 'Стабильный доход']}
            suggestions={['Увеличьте срок для снижения платежа']}
          />
        </div>
      </div>
    </motion.div>
  ) : null;
  
  const handleSearch = async (params: SearchParams) => {
    setMascotState('scanning');

    const searchParams = new URLSearchParams();
    if (params.amount) searchParams.set('amount', params.amount.toString());
    if (params.term) searchParams.set('term', params.term.toString());
    if (params.type) searchParams.set('type', params.type);

    router.push(`/search?${searchParams.toString()}`);
  };

  const features = [
    {
      title: "Параметры",
      description: "Укажите нужную сумму кредита или лимит по карте",
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      title: "AI-Анализ",
      description: "C-Unit сравнивает условия 50+ банков и МФО в реальном времени",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Одобрение",
      description: "Получите список предложений с максимальным шансом на успех",
      icon: <Shield className="w-6 h-6" />,
    },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Credium",
    "url": "https://credium.store",
    "applicationCategory": "FinanceApplication",
    "about": "Подбор кредитов, микрозаймов и банковских карт с помощью ИИ",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "RUB"
    }
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="container relative py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                AI-powered финтех
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Умный подбор кредитов{' '}
                <span className="gradient-text">займов и карт онлайн</span> за
                секунды
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                C-Unit проанализирует сотни предложений банков и МФО, чтобы найти самый низкий процент и высокую вероятность одобрения без справок.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="gap-2 text-base"
                  onClick={() => router.push('/onboarding')}
                >
                  Начать подбор
                  <ArrowRight className="w-5 h-5" />
                </Button>
                {!isTelegram ? <>  
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Быстрый поиск
                </Button>
                </> : ''} 
              </div>
            </motion.div>

            <div className="hidden lg:block">
              {rightContent}
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 Section */}
      <section id="top10-section" className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Топ-10 предложений</h2>
              <p className="text-muted-foreground">Лучшие продукты по AI-рейтингу</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/catalog')}>
              Смотреть все
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          <Top10List
            products={initialTop10Data || []}
            isLoading={!initialTop10Data}
            onProductClick={(id) => router.push(`/product/${id}`)}
          />
        </div>
      </section>

      {/* Mobile Right Content - показываем только на мобильных после Top 10 */}
      {!isTelegram && (
        <section className="lg:hidden py-8">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6"
            >
              <h3 className="text-2xl font-bold text-foreground mb-2">Ваш AI-помощник</h3>
              <p className="text-muted-foreground">C-Unit анализирует ваши данные для лучшего подбора</p>
            </motion.div>
            {rightContent}
          </div>
        </section>
      )}

      {!isTelegram ? <>    
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-soft transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Быстрый поиск продуктов
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Укажите желаемую сумму и срок — мы подберём оптимальные варианты
            </p>
          </motion.div>

          <SearchBar onSearch={handleSearch} isLoading={searchMutation.isPending} />
        </div>
      </section>
      </> : ''} 

      {!isTelegram ? <>     
      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary to-primary/80 overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative text-center">
              <CUnitMascot state="approve" size={80} className="mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Готовы найти лучшее предложение?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Пройдите быстрый онбординг — и C-Unit подберёт идеальный продукт для вас
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
                onClick={() => router.push('/onboarding')}
              >
                Начать подбор
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </> : ''} 
    </AppShell>
  );
}
