'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { ResultCard } from '@/components/ResultCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getTop10Products } from '@/services/mocks';
import { Product, ProductType } from '@/components/types';
import { CreditCard, Banknote, Wallet, SlidersHorizontal } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import api from '@/services/api';

const productTypeLabels: Record<ProductType, string> = {
  card: 'Карты',
  loan: 'Кредиты',
  microloan: 'Микрозаймы',
};

const productTypeIcons: Record<ProductType, React.ReactNode> = {
  card: <CreditCard className="h-4 w-4" />,
  loan: <Banknote className="h-4 w-4" />,
  microloan: <Wallet className="h-4 w-4" />,
};

export default function CatalogClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type')
  
  const [selectedType, setSelectedType] = useState<ProductType | null>(() => {
    if (typeParam === 'all' || !typeParam) {
      return null;
    }
    return typeParam as ProductType;
  });
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 5000000]);
  const [aprRange, setAprRange] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    const newType = searchParams.get('type');
    
    if (newType === 'all' || !newType) {
      setSelectedType(null);
    } else {
      setSelectedType(newType as ProductType);
    }
  }, [searchParams]);

  const handleTypeChange = (type: ProductType | null) => {
    setSelectedType(type);

    const params = new URLSearchParams(searchParams.toString());
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    router.push(`/catalog?${params.toString()}`);
  };

  const filteredProducts = useMemo(() => {
    console.log('=== Filtering products, selectedType ===', selectedType);
    console.log('=== Initial products count ===', initialProducts.length);
    
    const result = initialProducts.filter((product) => {
      if (selectedType && product.type !== selectedType) {
        console.log(`Product ${product.id} filtered out: type mismatch`);
        return false;
      }
      return true;
    });
    
    // 🔑 Сортировка по AI Score (от большего к меньшему)
    const sorted = result.sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
    
    console.log('=== Filtered products count ===', sorted.length);
    return sorted;
  }, [initialProducts, selectedType]);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": filteredProducts.length,
    "itemListElement": filteredProducts.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.title,
        "description": product.features?.join(', ') || product.badge || '',
        "brand": { "@type": "Brand", "name": product.bank || 'Bank' },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "RUB"
        }
      }
    }))
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Product Type Filter */}
      <div>
        <h4 className="text-sm font-medium mb-3">Тип продукта</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeChange(null)}
          >
            Все
          </Button>
          {(Object.keys(productTypeLabels) as ProductType[]).map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange(type)}
              className="gap-1.5"
            >
              {productTypeIcons[type]}
              {productTypeLabels[type]}
            </Button>
          ))}
        </div>
      </div>

      {/* Amount Range Filter */}
      {/* <div>
        <h4 className="text-sm font-medium mb-3">Сумма</h4>
        <Slider
          value={amountRange}
          onValueChange={(value) => setAmountRange(value as [number, number])}
          min={0}
          max={5000000}
          step={50000}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(amountRange[0])}</span>
          <span>{formatCurrency(amountRange[1])}</span>
        </div>
      </div> */}

      {/* APR Range Filter */}
      {/* <div>
        <h4 className="text-sm font-medium mb-3">Процентная ставка</h4>
        <Slider
          value={aprRange}
          onValueChange={(value) => setAprRange(value as [number, number])}
          min={0}
          max={100}
          step={1}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{aprRange[0]}%</span>
          <span>{aprRange[1]}%</span>
        </div>
      </div> */}
    </div>
  );
  

  const getTitle = () => {
    switch(selectedType) {
      case 'card': return "Кредитные карты";
      case 'loan': return "Кредиты наличными";
      case 'microloan': return "Микрозаймы";
      default: return "Каталог продуктов";
    }
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{getTitle()}</h1>
            <p className="text-muted-foreground mt-1">
              Найдено {filteredProducts.length} предложений
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Фильтры
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">Фильтры</h3>
              <FiltersContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="space-y-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ResultCard key={product.id} product={product} />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <p className="text-muted-foreground">
                  По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
