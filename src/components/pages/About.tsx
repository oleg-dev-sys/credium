'use client';

import { AppShell } from '@/components/AppShell';
import { CUnitMascot } from '@/components/CUnitMascot';
import { Shield, Zap, Users, Target } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Надёжность',
    description: 'Работаем только с проверенными банками и финансовыми организациями.',
  },
  {
    icon: Zap,
    title: 'Скорость',
    description: 'AI-алгоритмы анализируют предложения за секунды, экономя ваше время.',
  },
  {
    icon: Users,
    title: 'Клиентоориентированность',
    description: 'Подбираем продукты исходя из ваших потребностей, а не комиссий банков.',
  },
  {
    icon: Target,
    title: 'Точность',
    description: 'Высокая точность оценки одобрения благодаря машинному обучению.',
  },
];

export default function AboutContent() {
  return (
    <AppShell>
      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <CUnitMascot state="approve" size={120} />
          </div>
          <h1 className="text-4xl font-bold mb-4">О сервисе Credium</h1>
          <p className="text-lg text-muted-foreground">
            Credium — это AI-платформа для умного подбора кредитных продуктов. 
            Мы помогаем найти лучшие предложения от банков и оценить шансы на одобрение.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Наша миссия</h2>
          <p className="text-muted-foreground leading-relaxed">
            Сделать процесс получения кредита простым, прозрачным и выгодным для каждого. 
            Мы верим, что технологии искусственного интеллекта могут помочь людям принимать 
            более взвешенные финансовые решения и экономить на процентах.
          </p>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Наши ценности</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Как это работает</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium mb-1">Заполните анкету</h3>
                <p className="text-sm text-muted-foreground">
                  Укажите желаемую сумму, срок и базовую информацию о себе.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium mb-1">AI анализирует</h3>
                <p className="text-sm text-muted-foreground">
                  Наш алгоритм подбирает лучшие предложения и оценивает шансы.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium mb-1">Выберите продукт</h3>
                <p className="text-sm text-muted-foreground">
                  Сравните условия и подайте заявку напрямую в банк.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
