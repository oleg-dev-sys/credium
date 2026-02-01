import { motion } from 'framer-motion';
import { Trophy, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAPR } from '@/utils/formatCurrency';
import type { Product } from '@/components/types';
import Image from 'next/image';

interface Top10ListProps {
  products: Product[];
  isLoading?: boolean;
  onProductClick?: (id: string) => void;
}

export function Top10List({ products, isLoading, onProductClick }: Top10ListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.slice(0, 10).map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          onClick={() => onProductClick?.(product.id)}
          className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-soft cursor-pointer transition-all"
        >
          <div className="flex-shrink-0 w-10 h-10 relative">
          {/* Логотип */}
          {product.logo_url ? (
            <div className="relative w-10 h-10">
              <Image
                src={product.logo_url}
                alt={product.bank || 'Банк'}
                fill
                className="rounded-md object-contain border border-border"
                sizes="40px"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
              ?
            </div>
          )}

          {/* Иконка трофея поверх для топ-3 */}
          {index < 3 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center">
              {index === 0 ? (
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              ) : index === 1 ? (
                <Trophy className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
              )}
            </div>
          )}
        </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-foreground truncate">{product.title}</h4>
              {product.badge && (
                <Badge variant="outline" className="text-xs">
                  {product.badge}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{product.bank}</span>
              <span className="text-muted">•</span>
              <span>{formatAPR(product.apr)}</span>
            </div>
          </div>

          {/* AI Score */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="text-right">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="font-bold text-accent">{product.ai_score}</span>
              </div>
              <span className="text-xs text-muted-foreground">AI Score</span>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Top10List;
