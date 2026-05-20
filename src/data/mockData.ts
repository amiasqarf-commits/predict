export const wallets = [
  { id: '1', currency: 'EUR', symbol: '€', name: 'Операционный счет (Corp)', balance: 1250000, trend: -5, locked: 200000, bank: 'Deutsche Bank' },
  { id: '2', currency: 'USD', symbol: '$', name: 'Международные расчеты', balance: 850000, trend: 12, locked: 0, bank: 'JPMorgan Chase' },
  { id: '3', currency: 'GBP', symbol: '£', name: 'Резервный фонд', balance: 3400000, trend: 2, locked: 0, bank: 'HSBC' },
];

export const forecastData = [
  { date: '18 Мая', EUR: 1250000, USD: 850000, GBP: 3400000 },
  { date: '19 Мая', EUR: 1100000, USD: 860000, GBP: 3400000 },
  { date: '20 Мая', EUR: 800000, USD: 850000, GBP: 3400000 },
  { date: '21 Мая', EUR: 50000, USD: 900000, GBP: 3400000 },
  { date: '22 Мая', EUR: -150000, USD: 950000, GBP: 3400000 },
  { date: '23 Мая', EUR: -300000, USD: 1000000, GBP: 3400000 },
  { date: '24 Мая', EUR: -200000, USD: 1150000, GBP: 3400000 },
];

export type Recommendation = {
  fromWalletId: string;
  amountFrom: number;
  currencyFrom: string;
  amountTo: number;
  currencyTo: string;
  reason: string;
  eta: string;
};

export type AIAlert = {
  id: string;
  type: 'critical' | 'warning' | 'info';
  walletId: string;
  title: string;
  description: string;
  amountNeeded: number;
  currency: string;
  date: string;
  recommendation: Recommendation;
};

export const aiAlerts: AIAlert[] = [
  {
    id: 'a1',
    type: 'critical',
    walletId: '1',
    title: 'Риск кассового разрыва: EUR',
    description: 'Система прогнозирует нехватку средств на Операционном счете (EUR) к 22 мая. Причина: запланированные выплаты подрядчикам (€450,000) и задержка входящего платежа из-за выходного дня (Вознесение) в Европе.',
    amountNeeded: 250000,
    currency: 'EUR',
    date: '22 Мая',
    recommendation: {
      fromWalletId: '3',
      amountFrom: 215000, // Roughly 250k EUR in GBP
      currencyFrom: 'GBP',
      amountTo: 250000,
      currencyTo: 'EUR',
      reason: 'Оптимальный курс конвертации GBP/EUR. Внутренний перевод займет < 5 минут. Предотвратит штрафы за просрочку платежа (est. €3,750).',
      eta: 'Мгновенно'
    }
  }
];

export const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
