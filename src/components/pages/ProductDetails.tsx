'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Check, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AppShell } from '@/components/AppShell';
import { AIScoreCard } from '@/components/AIScoreCard';
import { CUnitMascot } from '@/components/CUnitMascot';
import { formatCurrency, formatAPR } from '@/utils/formatCurrency';
import { Product } from '@/components/types';

interface ProductDetailsProps {
  id: string;
  initialData: Product | null;
}


export default function ProductDetailsClient({ id, initialData }: ProductDetailsProps) {
  const router = useRouter();
  const product = initialData;

  const handleApply = () => {
    if (product?.tracking_url) {
      window.open(product.tracking_url, '_blank', 'noopener,noreferrer');
    }
  };


  if (!product) {
    return (
      <AppShell>
        <div className="container py-16 text-center">
          <CUnitMascot state="warn" size={80} className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Продукт не найден</h1>
          <p className="text-muted-foreground mb-6">
            К сожалению, запрашиваемый продукт не существует или был удалён
          </p>
          <Button onClick={() => router.push('/catalog')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться в каталог
          </Button>
        </div>
      </AppShell>
    );
  }
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'card':
        return 'Кредитная карта';
      case 'loan':
        return 'Кредит';
      case 'microloan':
        return 'Микрозайм';
      default:
        return type;
    }
  };

  const schemaData = product ? {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": product.title,
    "description": product.features?.join(', ') || '',
    "brand": {
      "@type": "Brand",
      "name": product.bank
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "RUB"
    }
  } : null;

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{getTypeLabel(product.type)}</Badge>
                    {product.badge && (
                      <Badge variant="secondary">{product.badge}</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {product.title}
                  </h1>
                </div>
                <AIScoreCard score={product.ai_score} compact />
              </div>

              {product.bank && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{product.bank}</span>
                </div>
              )}
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid sm:grid-cols-3 gap-4"
            >
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-1">Ставка</p>
                <p className="text-2xl font-bold text-foreground">{formatAPR(product.apr)}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-1">Платёж / мес</p>
                <p className="text-2xl font-bold text-foreground">
                  {product.monthly > 0 ? formatCurrency(product.monthly) : '—'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-1">Сумма</p>
                <p className="text-2xl font-bold text-foreground">
                  {product.max_amount
                    ? `до ${formatCurrency(product.max_amount, { showSymbol: false })} ₽`
                    : '—'}
                </p>
              </div>
            </motion.div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Особенности продукта
                </h2>
                <ul className="space-y-3">
                  {product.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Requirements */}
            {product.requirements && product.requirements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Требования
                </h2>
                <ul className="space-y-3">
                  {product.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 space-y-4"
            >
              {/* AI Analysis */}
              <AIScoreCard
                score={product.ai_score}
                explanation={['Хорошая процентная ставка', 'Удобные условия погашения']}
                suggestions={['Подходит для вашего профиля']}
              />

              {/* CTA Card */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <CUnitMascot state="approve" size={48} />
                  <div>
                    <p className="font-medium text-foreground">C-Unit рекомендует</p>
                    <p className="text-sm text-muted-foreground">Отличный выбор!</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button onClick={handleApply} className="w-full gap-2" size="lg">
                  Оформить заявку
                  <ExternalLink className="w-4 h-4" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Переход на сайт банка. Условия определяются банком.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
