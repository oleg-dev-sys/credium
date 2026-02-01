import { Metadata } from 'next';
import CatalogClient from '@/components/pages/Catalog';
import { Suspense } from 'react';
import api from '@/services/api';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
};


const seoDict: Record<string, { title: string; desc: string }> = {
  card: {
    title: "Кредитные карты онлайн — подобрать карту с кэшбэком и лимитом",
    desc: "Сравните лучшие кредитные карты с кэшбэком и льготным периодом. Подбор по лимиту и стоимости обслуживания через AI."
  },
  loan: {
    title: "Подобрать кредит наличными — низкие ставки и быстрое одобрение",
    desc: "Все потребительские кредиты в одном месте. Найдите самую низкую процентную ставку и оформите заявку онлайн."
  },
  microloan: {
    title: "Займы на карту без отказа — микрозаймы онлайн под 0%",
    desc: "Срочные займы без проверок и справок. Список МФО с мгновенным одобрением на карту круглосуточно."
  },
  default: {
    title: "Каталог кредитных продуктов — AI-подбор Credium",
    desc: "Умный поиск кредитов, карт и займов. Наш AI-алгоритм анализирует предложения 50+ банков для максимального одобрения."
  }
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const type = (searchParams.type as string) || 'default';
  
  const seo = seoDict[type] || seoDict.default;

  return {
    title: seo.title,
    description: seo.desc,
    openGraph: {
      title: seo.title,
      description: seo.desc,
      images: ['https://credium.store/og-main.png'],
      url: `https://credium.store/catalog${type !== 'default' ? `?type=${type}` : ''}`,
    },
    alternates: {
      canonical: `https://credium.store/catalog${type !== 'default' ? `?type=${type}` : ''}`,
    }
  };
}

export default async function CatalogPage() {
    const initialProducts = await api.getProducts();
    
    return (
    <Suspense fallback={<div className="container py-8">Загрузка каталога...</div>}>
        <CatalogClient initialProducts={initialProducts}/>
    </Suspense>
    );
}