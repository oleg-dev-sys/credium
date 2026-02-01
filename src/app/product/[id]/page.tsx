// app/product/[id]/page.tsx
import { Metadata } from 'next';
import ProductDetailsClient from '@/components/pages/ProductDetails';
import api from '@/services/api';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Продукт | Credium',
    description: 'Подробные условия кредитного продукта',
  };
}

export default async function ProductPage({ params }: Props) {
  console.log('=== ProductPage params ===', params);
  
  const id = params?.id;
  
  console.log('=== ID ===', id);

  if (!id) {
    console.error('No ID provided');
    return <div>Ошибка: не указан ID продукта</div>;
  }

  try {
    const initialData = await api.getProduct(id);
    console.log('=== Product loaded ===', initialData);
    return <ProductDetailsClient id={params.id} initialData={initialData} />;
  } catch (error) {
    console.error('Error loading product:', error);
    return <div>Ошибка загрузки продукта</div>;
  }
}