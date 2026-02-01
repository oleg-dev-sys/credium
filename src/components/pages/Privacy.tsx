import { AppShell } from '@/components/AppShell';

export default function Privacy() {
  return (
    <AppShell>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Политика конфиденциальности</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Сбор информации</h2>
            <p className="text-muted-foreground">
              Мы собираем информацию, которую вы предоставляете при использовании сервиса: 
              данные о доходах, желаемой сумме кредита, информацию о существующих обязательствах. 
              Эти данные необходимы для подбора подходящих предложений.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Использование информации</h2>
            <p className="text-muted-foreground">
              Собранные данные используются исключительно для:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Персонализированного подбора кредитных продуктов</li>
              <li>Расчёта вероятности одобрения</li>
              <li>Улучшения качества сервиса</li>
              <li>Связи с вами по вопросам использования сервиса</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Защита данных</h2>
            <p className="text-muted-foreground">
              Мы применяем современные методы защиты информации. Ваши данные хранятся на 
              защищённых серверах и не передаются третьим лицам без вашего согласия.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Cookies</h2>
            <p className="text-muted-foreground">
              Сервис использует cookies для улучшения пользовательского опыта. Вы можете 
              управлять настройками cookies в своём браузере.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Права пользователя</h2>
            <p className="text-muted-foreground">
              Вы имеете право:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Запросить информацию о хранимых данных</li>
              <li>Потребовать удаления ваших данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Изменения политики</h2>
            <p className="text-muted-foreground">
              Мы можем обновлять данную политику. Актуальная версия всегда доступна на этой странице.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Контакты</h2>
            <p className="text-muted-foreground">
              По вопросам конфиденциальности обращайтесь через раздел "Контакты" на сайте.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
