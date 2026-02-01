import { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';

const LAST_UPDATED = '15 января 2026';

export const metadata: Metadata = {
  title: 'Условия использования — Credium',
  description: 'Условия использования сервиса Credium для подбора кредитных продуктов',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Условия использования — Credium',
    description: 'Условия использования сервиса',
  },
};

export default function TermsPage() {
  return (
    <AppShell>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Условия использования</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Последнее обновление: {LAST_UPDATED}
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Общие положения</h2>
            <p className="text-muted-foreground">
              Настоящие Условия использования регулируют порядок использования сервиса Credium. 
              Используя наш сервис, вы соглашаетесь с данными условиями.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Описание сервиса</h2>
            <p className="text-muted-foreground">
              Credium — это информационный сервис подбора кредитных продуктов с использованием 
              технологий искусственного интеллекта. Мы помогаем пользователям найти наиболее 
              подходящие финансовые предложения на основе их профиля.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Ограничение ответственности</h2>
            <p className="text-muted-foreground">
              Сервис носит исключительно информационный характер. Мы не являемся финансовой 
              организацией и не предоставляем кредитные продукты. Финальные условия определяются 
              банками и кредитными организациями.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Использование данных</h2>
            <p className="text-muted-foreground">
              Предоставляя свои данные, вы даёте согласие на их обработку в соответствии с нашей 
              Политикой конфиденциальности. Мы используем данные исключительно для подбора 
              подходящих предложений.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Права и обязанности</h2>
            <p className="text-muted-foreground">
              Пользователь обязуется предоставлять достоверную информацию и не использовать 
              сервис в противоправных целях. Credium оставляет за собой право изменять условия 
              использования с уведомлением пользователей.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Контакты</h2>
            <p className="text-muted-foreground">
              По вопросам, связанным с условиями использования, вы можете связаться с нами 
              через раздел "Контакты" на сайте.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}