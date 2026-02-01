// app/product/[id]/page.tsx
import { Metadata } from 'next';
import ProductDetailsClient from '@/components/pages/ProductDetails';
import api from '@/services/api';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await api.getProduct(params.id);
    
    return {
      title: `${product.title} в ${product.bank} — условия, ставки и отзывы | Credium`,
      description: `Подробные условия продукта ${product.title}: ставка от ${product.apr}%, сумма до ${product.max_amount} руб. AI-анализ вероятности одобрения на Credium.`,
      openGraph: {
        images: [product.logo_url || '/og-product.png'],
      },
    };
  } catch {
    return { title: 'Продукт не найден | Credium' };
  }
}

export default async function ProductPage({ params }: Props) {
  const initialData = await api.getProduct(params.id);

  return <ProductDetailsClient id={params.id} initialData={initialData} />;
}