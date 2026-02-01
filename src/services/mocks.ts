import type { Product, SearchResponse, ApprovalCheckResponse } from '@/components/types';

/** Mock product data */
export const mockProducts: Product[] = [
  {
    id: 'card_1',
    title: 'Cashback Card X',
    type: 'card',
    apr: 14.5,
    monthly: 1250,
    badge: 'Top10',
    ai_score: 78,
    bank: 'Alpha Bank',
    features: ['5% кэшбэк на рестораны', 'Бесплатное обслуживание', 'Apple Pay / Google Pay'],
    max_amount: 500000,
    term: 'Бессрочно',
  },
  {
    id: 'card_2',
    title: 'Premium Travel Card',
    type: 'card',
    apr: 19.9,
    monthly: 990,
    badge: 'Популярное',
    ai_score: 85,
    bank: 'Tinkoff',
    features: ['Мили за покупки', 'Бесплатные залы ожидания', 'Страховка путешественника'],
    max_amount: 1000000,
    term: 'Бессрочно',
  },
  {
    id: 'loan_1',
    title: 'Personal Loan Z',
    type: 'loan',
    apr: 11.9,
    monthly: 8200,
    ai_score: 64,
    bank: 'Sberbank',
    features: ['Без залога', 'Быстрое решение', 'Досрочное погашение без штрафов'],
    max_amount: 3000000,
    min_amount: 100000,
    term: '12-60 месяцев',
  },
  {
    id: 'loan_2',
    title: 'Экспресс Кредит',
    type: 'loan',
    apr: 15.5,
    monthly: 12500,
    badge: 'Быстрое одобрение',
    ai_score: 72,
    bank: 'VTB',
    features: ['Решение за 5 минут', 'Минимум документов', 'Онлайн оформление'],
    max_amount: 1000000,
    min_amount: 50000,
    term: '6-36 месяцев',
  },
  {
    id: 'microloan_1',
    title: 'МикроЗайм Быстро',
    type: 'microloan',
    apr: 0.8,
    monthly: 2100,
    badge: 'Первый займ 0%',
    ai_score: 55,
    bank: 'MoneyMan',
    features: ['Первый займ без процентов', 'Деньги за 15 минут', 'На карту любого банка'],
    max_amount: 30000,
    min_amount: 1000,
    term: '5-30 дней',
  },
  {
    id: 'microloan_2',
    title: 'Срочный Займ',
    type: 'microloan',
    apr: 1.0,
    monthly: 1800,
    ai_score: 48,
    bank: 'Займер',
    features: ['Без проверки КИ', '24/7 одобрение', 'Продление срока'],
    max_amount: 50000,
    min_amount: 3000,
    term: '7-30 дней',
  },
  {
    id: 'card_3',
    title: 'Дебетовая Мультикарта',
    type: 'card',
    apr: 0,
    monthly: 0,
    badge: 'Без комиссий',
    ai_score: 92,
    bank: 'Raiffeisen',
    features: ['Кэшбэк до 5%', 'Бесплатные переводы', 'Проценты на остаток'],
    max_amount: 0,
    term: 'Бессрочно',
  },
  {
    id: 'loan_3',
    title: 'Рефинансирование',
    type: 'loan',
    apr: 9.9,
    monthly: 15600,
    badge: 'Лучшая ставка',
    ai_score: 81,
    bank: 'Газпромбанк',
    features: ['Объединение кредитов', 'Снижение платежа', 'Кредитные каникулы'],
    max_amount: 5000000,
    min_amount: 300000,
    term: '24-84 месяца',
  },
];

/** Get top 10 products */
export function getTop10Products(): Product[] {
  return [...mockProducts]
    .sort((a, b) => b.ai_score - a.ai_score)
    .slice(0, 10);
}

/** Search products with filters */
export function searchProducts(
  amount?: number,
  type?: string
): SearchResponse {
  let filtered = [...mockProducts];

  if (type && type !== 'all') {
    filtered = filtered.filter((p) => p.type === type);
  }

  if (amount) {
    filtered = filtered.filter((p) => {
      if (p.max_amount && p.max_amount >= amount) return true;
      if (!p.max_amount) return true;
      return false;
    });
  }

  const avgScore = Math.round(
    filtered.reduce((acc, p) => acc + p.ai_score, 0) / (filtered.length || 1)
  );

  return {
    results: filtered.sort((a, b) => b.ai_score - a.ai_score),
    aiSummary: {
      score: avgScore,
      explanation: [
        'Низкая кредитная нагрузка',
        'Стабильный доход',
        'Длительная кредитная история',
      ],
      suggestions: [
        'Рассмотрите увеличение срока для снижения платежа',
        'Подтвердите доход справкой 2-НДФЛ',
      ],
    },
  };
}

/** Get product by ID */
export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

/** Calculate approval chance */
export function calculateApprovalChance(params: {
  amount: number;
  income: number;
  creditScore: number;
}): ApprovalCheckResponse {
  const { amount, income, creditScore } = params;

  // Simple deterministic calculation
  const incomeRatio = Math.min((income * 12) / amount, 1) * 40;
  const scoreBonus = (creditScore / 100) * 40;
  const baseChance = 20;

  const chance = Math.min(Math.round(baseChance + incomeRatio + scoreBonus), 99);

  return {
    chance,
    factors: [
      { name: 'Длительность кредитной истории', weight: 20 },
      { name: 'Уровень дохода', weight: 35 },
      { name: 'Кредитный скоринг', weight: 30 },
      { name: 'Текущая нагрузка', weight: 15 },
    ],
    suggestions:
      chance < 70
        ? ['Добавьте созаёмщика', 'Предоставьте залог', 'Уменьшите запрашиваемую сумму']
        : ['Отличные шансы! Подайте заявку прямо сейчас'],
  };
}
