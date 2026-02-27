import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogArticles } from '@/data/articles';
import BlogArticleClient from '@/components/pages/BlogArticleClient';

// 1. Генерируем статические параметры для всех статей
export async function generateStaticParams() {
  console.log('=== generateStaticParams вызван ===');
  console.log('Статьи:', blogArticles.map(a => a.id));
  return blogArticles.map((article) => ({
    id: article.id,
  }));
}

// 2. Динамические мета-теги для каждой статьи
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const article = blogArticles.find((a) => a.id === id);

  if (!article) {
    return {
      title: 'Статья не найдена',
    };
  }

  return {
    title: `${article.title} | Блог Credium`,
    description: article.seo?.description || article.excerpt,
    keywords: article.seo?.keywords,
    alternates: {
      canonical: `https://credium.store/blog/${id}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: ['Credium Team'],
    },
  };
}

// 3. Серверный компонент страницы
export default async function BlogArticlePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const article = blogArticles.find((a) => a.id === id);

  if (!article) {
    notFound(); // Вернет стандартную страницу 404 Next.js
  }

  // Находим похожие статьи (той же категории, кроме текущей)
  const relatedArticles = blogArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.seo?.description || article.excerpt,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Organization",
      "name": "Credium",
      "url": "https://credium.store"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Credium",
      "url": "https://credium.store",
      "logo": {
        "@type": "ImageObject",
        "url": "https://credium.store/logo.png",
        "width": 600,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://credium.store/blog/${id}`
    }
  };  

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticleClient 
        article={article} 
        relatedArticles={relatedArticles} 
      />
    </>
  );
}