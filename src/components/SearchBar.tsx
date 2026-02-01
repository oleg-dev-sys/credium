import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/utils/formatCurrency';
import type { ProductType, SearchParams } from '@/components/types';

interface SearchBarProps {
  /** Search handler */
  onSearch: (params: SearchParams) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Show expanded filters */
  expanded?: boolean;
}

/**
 * Search bar with filters for credit products
 */
export function SearchBar({ onSearch, isLoading, expanded = false }: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(expanded);
  const [amount, setAmount] = useState(300000);
  const [period, setPeriod] = useState(12);
  const [type, setType] = useState<ProductType | 'all'>('all');
  const [creditScore, setCreditScore] = useState(0);
  const [income, setIncome] = useState(80000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: SearchParams = { amount, period, creditScore, income };
    if (type !== 'all') {
      params.type = type; // отправляем type ТОЛЬКО если выбран конкретный тип
    }
    onSearch(params);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl bg-card border border-border shadow-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Main Search Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Amount Input */}
        <div className="flex-1">
          <Label htmlFor="amount" className="text-sm text-muted-foreground mb-2 block">
            Сумма
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="pr-8"
              min={1000}
              max={10000000}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              ₽
            </span>
          </div>
        </div>

        {/* Product Type */}
        <div className="flex-1">
          <Label htmlFor="type" className="text-sm text-muted-foreground mb-2 block">
            Тип продукта
          </Label>
          <Select value={type} onValueChange={(v) => setType(v as ProductType | 'all')}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все продукты</SelectItem>
              <SelectItem value="card">Кредитные карты</SelectItem>
              <SelectItem value="loan">Кредиты</SelectItem>
              <SelectItem value="microloan">Микрозаймы</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Period */}
        <div className="flex-1">
          <Label htmlFor="period" className="text-sm text-muted-foreground mb-2 block">
            Срок (мес.)
          </Label>
          <Input
            id="period"
            type="number"
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            min={1}
            max={84}
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end gap-2">
          <Button type="submit" className="gap-2" disabled={isLoading}>
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Найти</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Расширенные фильтры"
            aria-expanded={showFilters}
          >
            <Sliders className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Extended Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t border-border"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Income */}
            <div>
              <div className="flex justify-between mb-3">
                <Label className="text-sm text-muted-foreground">Доход в месяц</Label>
                <span className="text-sm font-medium">{formatCurrency(income)}</span>
              </div>
              <Slider
                value={[income]}
                onValueChange={([v]) => setIncome(v)}
                min={10000}
                max={500000}
                step={5000}
              />
            </div>

            {/* Credit Score */}
            <div>
              <div className="flex justify-between mb-3">
                <Label className="text-sm text-muted-foreground">
                  Средние месячные расходы
                </Label>
                <span className="text-sm font-medium">{creditScore}</span>
              </div>
              <Slider
                value={[creditScore]}
                onValueChange={([v]) => setCreditScore(v)}
                min={0}
                max={income}
                step={1000}
              />
            </div>
          </div>
        </motion.div>
      )}
    </motion.form>
  );
}

export default SearchBar;
