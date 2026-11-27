import type { ChartPoint, ExpenseCategory } from '../../types/finance';

// Placeholder data until the app reads real accounts.

export type Period = 'week' | 'month' | 'year' | 'range';

export const PERIOD_OPTIONS = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
  { value: 'range', label: 'Rango' },
] as const satisfies readonly { value: Period; label: string }[];

export type PeriodStats = {
  label: string;
  total: number;
  /** Change vs the previous period (negative = spent less). */
  delta: number;
  deltaLabel: string;
  flowTitle: string;
  flow: ChartPoint[];
  average: number;
  averageLabel: string;
  peakIndex: number;
};

const monthStats: PeriodStats = {
  label: 'Noviembre 2026',
  total: 2460,
  delta: -320,
  deltaLabel: 'menos que el mes anterior',
  flowTitle: 'Flujo semanal',
  flow: [
    { label: 'Sem 1', value: 58 },
    { label: '', value: 70 },
    { label: '', value: 76 },
    { label: 'Sem 2', value: 66 },
    { label: '', value: 92 },
    { label: 'Sem 3', value: 128 },
    { label: '', value: 142 },
    { label: 'Sem 4', value: 84 },
    { label: '', value: 40 },
    { label: 'Cierre', value: 104 },
  ],
  average: 82,
  averageLabel: 'Media $82/día',
  peakIndex: 6,
};

export const statsByPeriod: Record<Period, PeriodStats> = {
  week: {
    label: 'Esta semana',
    total: 574,
    delta: 48,
    deltaLabel: 'más que la semana anterior',
    flowTitle: 'Flujo diario',
    flow: [
      { label: 'Lun', value: 64 },
      { label: 'Mar', value: 52 },
      { label: 'Mié', value: 96 },
      { label: 'Jue', value: 71 },
      { label: 'Vie', value: 138 },
      { label: 'Sáb', value: 102 },
      { label: 'Dom', value: 51 },
    ],
    average: 82,
    averageLabel: 'Media $82/día',
    peakIndex: 4,
  },
  month: monthStats,
  year: {
    label: '2026',
    total: 28940,
    delta: -1210,
    deltaLabel: 'menos que el año anterior',
    flowTitle: 'Flujo mensual',
    flow: [
      { label: 'Ene', value: 2310 },
      { label: '', value: 2580 },
      { label: 'Mar', value: 2190 },
      { label: '', value: 2440 },
      { label: 'May', value: 2760 },
      { label: '', value: 3120 },
      { label: 'Jul', value: 2650 },
      { label: '', value: 2380 },
      { label: 'Sep', value: 2510 },
      { label: '', value: 2780 },
      { label: 'Nov', value: 2460 },
    ],
    average: 2560,
    averageLabel: 'Media $2.5k/mes',
    peakIndex: 5,
  },
  range: { ...monthStats, label: 'Personalizado', flowTitle: 'Flujo del rango' },
};

export const categories: ExpenseCategory[] = [
  { id: 'housing', name: 'Vivienda y Servicios', amount: 934.8, share: 0.38, icon: 'business-outline' },
  { id: 'food', name: 'Alimentación y Cenas', amount: 590.4, share: 0.24, icon: 'restaurant-outline' },
  { id: 'transport', name: 'Transporte y Movilidad', amount: 344.4, share: 0.14, icon: 'bus-outline' },
  { id: 'leisure', name: 'Ocio y Entretenimiento', amount: 295.2, share: 0.12, icon: 'film-outline' },
  { id: 'other', name: 'Otros y Suscripciones', amount: 295.2, share: 0.12, icon: 'albums-outline' },
];

export const prediction = {
  confidence: 96,
  projected: 2740,
  target: 3000,
  note: 'Si mantienes tu gasto diario de **$79.35**, superarás tu margen de seguridad 4 días antes de fin de mes.',
};
