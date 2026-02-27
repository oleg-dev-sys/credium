'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/AppShell';
import { useRouter } from 'next/navigation';
import type { BlogArticle } from '@/data/articles';

interface BlogClientProps {
  initialArticles: BlogArticle[];
}

const categories = ['Все', 'Кредитный рейтинг', 'Кредиты', 'Карты', 'Микрозаймы', 'Технологии', 'Финансы'];

export default function BlogClient({ initialArticles }: BlogClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const { filteredArticles, featuredArticle } = useMemo(() => {
    const featured = initialArticles.find((a) => a.featured);

    const filtered = initialArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'Все' || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return { filteredArticles: filtered, featuredArticle: featured };
  }, [initialArticles, searchQuery, selectedCategory]);

  const handleArticleClick = (id: string) => {
    router.push(`/blog/${id}`);
  };

  return (
    <AppShell>
      <div className="container py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Экспертные материалы
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Блог Credium
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Полезные статьи о кредитах, финансах и умном управлении деньгами
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 space-y-6"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Поиск статей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-4"
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Featured Article */}
        {featuredArticle && selectedCategory === 'Все' && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div
              onClick={() => handleArticleClick(featuredArticle.id)}
              className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/5 via-accent/5 to-card border border-border overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  Рекомендуем
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-3xl text-lg leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredArticle.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredArticle.readTime} мин на чтение
                  </div>
                  <div className="flex items-center gap-2 text-primary group-hover:translate-x-1 transition-transform">
                    Читать далее <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleArticleClick(article.id)}
              className="group flex flex-col p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-soft cursor-pointer transition-all duration-300 h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className="bg-muted text-foreground">
                  {article.category}
                </Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-grow">
                {article.excerpt}
              </p>

              <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(article.date).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime} мин
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border"
          >
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска или категорию</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Все');
              }}
            >
              Сбросить фильтры
            </Button>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}