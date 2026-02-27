'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/AppShell';
import { useRouter } from 'next/navigation';
import { BlogArticle } from '@/data/articles';

interface BlogArticleClientProps {
  article: BlogArticle;
  relatedArticles: BlogArticle[];
}

export default function BlogArticleClient({ article, relatedArticles }: BlogArticleClientProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Возврат на предыдущую страницу
  };

  const handleRelatedClick = (id: string) => {
    router.push(`/blog/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppShell>
      <article className="container max-w-4xl py-12 md:py-16">
        {/* Навигация назад */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="group text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Назад к списку
          </Button>
        </motion.div>

        {/* Заголовок и мета */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              <Tag className="w-3 h-3 mr-1.5" />
              {article.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} мин
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
            {article.title}
          </h1>

          <div className="p-6 rounded-2xl bg-muted/50 border border-border">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
              {article.excerpt}
            </p>
          </div>
        </motion.header>

        {/* Контент статьи */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg prose-neutral dark:prose-invert max-w-none"
        >
          {article.content && article.content.length > 0 ? (
            article.content.map((block, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05 }}
                className="mb-6"
              >
                {block.type === 'heading' && (
                  <h2 className="text-2xl font-bold text-foreground mt-10 mb-4 scroll-mt-24">
                    {block.text}
                  </h2>
                )}
                
                {block.type === 'paragraph' && (
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    {block.text}
                  </p>
                )}

                {block.type === 'list' && (
                  <ul className="space-y-3 my-6 pl-4">
                    {block.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground italic">Контент статьи загружается...</p>
          )}
        </motion.div>

        {/* CTA Блок (из текста статьи) */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
        >
          <h3 className="text-2xl font-bold mb-4">Нужна помощь в подборе?</h3>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl">
            Начните бесплатный подбор на Credium и получите персональные предложения за 2–5 минут.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => router.push('/catalog?type=all')}
            className="font-semibold"
          >
            Подобрать продукт сейчас
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Button>
        </motion.div>

        {/* Похожие статьи */}
        {relatedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 pt-10 border-t border-border"
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">Читайте также</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <div
                  key={related.id}
                  onClick={() => handleRelatedClick(related.id)}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-soft cursor-pointer transition-all duration-300"
                >
                  <Badge variant="outline" className="mb-3 text-xs">
                    {related.category}
                  </Badge>
                  <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {related.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </AppShell>
  );
}