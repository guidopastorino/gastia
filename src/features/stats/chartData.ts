import type { ChartPoint } from '../../types/finance';
import type { Period, StatsBucket } from './api';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MONTHS_LONG = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/** "2026-11-27" as a local date (not UTC midnight). */
function parseDay(day: string) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Balance at the end of each bucket, labelled for the axis. Month view labels every 7th day
 * and year view every other month so the labels never overlap.
 */
export function balancePoints(period: Period, buckets: StatsBucket[]): ChartPoint[] {
  return buckets.map((b, i) => {
    const d = parseDay(b.start);
    switch (period) {
      case 'week':
        return {
          label: WEEKDAYS[d.getDay()],
          value: b.balance,
        };
      case 'month':
        return {
          label: i % 7 === 0 ? String(d.getDate()) : '',
          value: b.balance,
        };
      case 'year':
        return {
          label: i % 2 === 0 ? MONTHS[d.getMonth()] : '',
          value: b.balance,
        };
    }
  });
}

export function periodLabel(period: Period, now = new Date()) {
  switch (period) {
    case 'week':
      return 'Últimos 7 días';
    case 'month':
      return `${MONTHS_LONG[now.getMonth()]} ${now.getFullYear()}`;
    case 'year':
      return String(now.getFullYear());
  }
}
