import type { Product, SearchResponse, ApprovalCheckResponse } from '@/types';

/** Mock product data */
export const mockProducts: Product[] = [
  {
    id: 'card_1',
    title: 'Cashback Card X',
    type: 'card',
    apr: 14.5,
    monthly: 1250,
    badge: 'Top10',
    aiScore: 78,
    bank: 'Alpha Bank',
    features: ['5% кэшбэк на рестораны', 'Бесплатное обслуживание', 'Apple Pay / Google Pay'],
    maxAmount: 500000,
    term: 'Бессрочно',
  },
  {
    id: 'card_2',
    title: 'Premium Travel Card',
    type: 'card',
    apr: 19.9,
    monthly: 990,
    badge: 'Популярное',
    aiScore: 85,
    bank: 'Tinkoff',
    features: ['Мили за покупки', 'Бесплатные залы ожидания', 'Страховка путешественника'],
    maxAmount: 1000000,
    term: 'Бессрочно',
  },
  {
    id: 'loan_1',
    title: 'Personal Loan Z',
    type: 'loan',
    apr: 11.9,
    monthly: 8200,
    aiScore: 64,
    bank: 'Sberbank',
    features: ['Без залога', 'Быстрое решение', 'Досрочное погашение без штрафов'],
    maxAmount: 3000000,
    minAmount: 100000,
    term: '12-60 месяцев',
  },
  {
    id: 'loan_2',
    title: 'Экспресс Кредит',
    type: 'loan',
    apr: 15.5,
    monthly: 12500,
    badge: 'Быстрое одобрение',
    aiScore: 72,
    bank: 'VTB',
    features: ['Решение за 5 минут', 'Минимум документов', 'Онлайн оформление'],
    maxAmount: 1000000,
    minAmount: 50000,
    term: '6-36 месяцев',
  },
  {
    id: 'microloan_1',
    title: 'МикроЗайм Быстро',
    type: 'microloan',
    apr: 0.8,
    monthly: 2100,
    badge: 'Первый займ 0%',
    aiScore: 55,
    bank: 'MoneyMan',
    features: ['Первый займ без процентов', 'Деньги за 15 минут', 'На карту любого банка'],
    maxAmount: 30000,
    minAmount: 1000,
    term: '5-30 дней',
  },
  {
    id: 'microloan_2',
    title: 'Срочный Займ',
    type: 'microloan',
    apr: 1.0,
    monthly: 1800,
    aiScore: 48,
    bank: 'Займер',
    features: ['Без проверки КИ', '24/7 одобрение', 'Продление срока'],
    maxAmount: 50000,
    minAmount: 3000,
    term: '7-30 дней',
  },
  {
    id: 'card_3',
    title: 'Дебетовая Мультикарта',
    type: 'card',
    apr: 0,
    monthly: 0,
    badge: 'Без комиссий',
    aiScore: 92,
    bank: 'Raiffeisen',
    features: ['Кэшбэк до 5%', 'Бесплатные переводы', 'Проценты на остаток'],
    maxAmount: 0,
    term: 'Бессрочно',
  },
  {
    id: 'loan_3',
    title: 'Рефинансирование',
    type: 'loan',
    apr: 9.9,
    monthly: 15600,
    badge: 'Лучшая ставка',
    aiScore: 81,
    bank: 'Газпромбанк',
    features: ['Объединение кредитов', 'Снижение платежа', 'Кредитные каникулы'],
    maxAmount: 5000000,
    minAmount: 300000,
    term: '24-84 месяца',
  },
];

/** Get top 10 products */
export function getTop10Products(): Product[] {
  return [...mockProducts]
    .sort((a, b) => b.aiScore - a.aiScore)
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
      if (p.maxAmount && p.maxAmount >= amount) return true;
      if (!p.maxAmount) return true;
      return false;
    });
  }

  const avgScore = Math.round(
    filtered.reduce((acc, p) => acc + p.aiScore, 0) / (filtered.length || 1)
  );

  return {
    results: filtered.sort((a, b) => b.aiScore - a.aiScore),
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
