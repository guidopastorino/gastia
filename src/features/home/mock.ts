import type { Transaction } from '../../types/finance';

// Placeholder data until the app reads real accounts.

export const balance = {
  total: 24850.4,
  currency: 'USD',
  changePct: 12.4,
  changeAmount: 2740,
};

export const recommendation = {
  title: 'Sugerencia de hoy',
  text: 'Gastaste un 18% menos en suscripciones esta semana. Puedes destinar $140 extra a tu meta de inversión.',
};

export const income = {
  amount: 5200,
  changePct: 8.2,
  trend: [3, 3.6, 3.3, 4.4, 4.1, 5.2, 4.9, 6.1],
};

export const expenses = {
  amount: 2460,
  limit: 4700,
};

export const recentTransactions: Transaction[] = [
  {
    id: 't1',
    title: 'Supermercado Orgánico',
    subtitle: 'Hoy, 11:34 AM • Alimentación',
    amount: -84.5,
    method: 'Tarjeta de débito',
    icon: 'bag-handle-outline',
  },
  {
    id: 't2',
    title: 'Nómina Tech Corp',
    subtitle: 'Ayer • Transferencia directa',
    amount: 3200,
    method: 'Ref #4829',
    icon: 'cash-outline',
    tag: 'Ingreso',
  },
  {
    id: 't3',
    title: 'Apple Services',
    subtitle: '18 Oct • Suscripciones',
    amount: -14.99,
    method: 'Apple Pay',
    icon: 'albums-outline',
  },
  {
    id: 't4',
    title: 'Fondo de Ahorro Indexado',
    subtitle: '16 Oct • Inversión recurrente',
    amount: -300,
    method: 'Automático',
    icon: 'wallet-outline',
  },
];
