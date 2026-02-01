import { motion } from 'framer-motion';
import { ArrowRight, Star, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIScoreCard } from './AIScoreCard';
import { formatCurrency, formatAPR } from '@/utils/formatCurrency';
import type { Product } from '@/components/types';

interface ResultCardProps {
  product: Product;
  index?: number;
  onDetails?: (id: string) => void;
}

export function ResultCard({
  product,
  index = 0,
  onDetails,
}: ResultCardProps) {
  const getBadgeIcon = (badge: string) => {
    if (badge.includes('Top')) return <Star className="w-3 h-3" />;
    if (badge.includes('Быстр')) return <Zap className="w-3 h-3" />;
    if (badge.includes('Популярн')) return <Clock className="w-3 h-3" />;
    return null;
  };
  
  const handleApply = () => {
    if (product.tracking_url) {
      // Открываем в новой вкладке
      window.open(product.tracking_url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn(`No tracking_url for product ${product.id}`);
      // Опционально: показать уведомление
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group p-5 rounded-xl bg-card border border-border shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Логотип банка */}
          {product.logo_url ? (
            <div className="flex-shrink-0 w-12 h-12">
              <img
                src={product.logo_url}
                alt={product.bank || 'Банк'}
                className="w-12 h-12 rounded-md object-contain border border-border bg-white"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-12 h-12 rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
              ?
            </div>
          )}

          <div>
            {/* Badge */}
            {product.badge && (
              <Badge variant="secondary" className="mb-2 gap-1">
                {getBadgeIcon(product.badge)}
                {product.badge}
              </Badge>
            )}
            
            {/* Title & Bank */}
            <h3 className="font-semibold text-lg text-foreground">{product.title}</h3>
            {product.bank && (
              <p className="text-sm text-muted-foreground">{product.bank}</p>
            )}
          </div>
        </div>

        {/* AI Score Compact */}
        <AIScoreCard score={product.ai_score} compact />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Ставка</p>
          <p className="font-semibold text-foreground">{formatAPR(product.apr)}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Макс. сумма</p>
          <p className="font-semibold text-foreground">
            {(product.max_amount ?? 0) > 0 
              ? formatCurrency(product.max_amount ?? 0) 
              : 'По данным банка'}
          </p>
        </div>
      </div>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <ul className="mb-4 space-y-1">
          {product.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {/* <Button
          variant="outline"
          className="flex-1"
          onClick={() => onDetails?.(product.id)}
        >
          Подробнее
        </Button> */}
        <Button
          className="flex-1 gap-2 group/btn"
          onClick={handleApply}
        >
          Оформить
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
}

export default ResultCard;
