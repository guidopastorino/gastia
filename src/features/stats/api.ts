import { supabase } from '../../lib/supabase';

export type Period = 'week' | 'month' | 'year';

export type StatsBucket = {
  /** First local day of the bucket, "YYYY-MM-DD" (a day for week/month, a month for year). */
  start: string;
  income: number;
  expense: number;
  /** Total balance at the end of the bucket. */
  balance: number;
};

export type Stats = {
  income: number;
  expense: number;
  /** Same stretch of the previous period (e.g. Oct 1–27 when today is Nov 27). */
  prevIncome: number;
  prevExpense: number;
  daysElapsed: number;
  daysInMonth: number;
  buckets: StatsBucket[];
};

type StatsRow = {
  income: number;
  expense: number;
  prev_income: number;
  prev_expense: number;
  days_elapsed: number;
  days_in_month: number;
  buckets: StatsBucket[] | null;
};

/** Device time zone, so "today" and month boundaries match what the user sees. */
function timeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export async function fetchStats(period: Period): Promise<Stats> {
  const { data, error } = await supabase.rpc('get_stats', { p_period: period, p_tz: timeZone() });
  if (error) throw error;
  const s = data as unknown as StatsRow;
  return {
    income: Number(s.income),
    expense: Number(s.expense),
    prevIncome: Number(s.prev_income),
    prevExpense: Number(s.prev_expense),
    daysElapsed: s.days_elapsed,
    daysInMonth: s.days_in_month,
    buckets: (s.buckets ?? []).map((b) => ({
      start: b.start,
      income: Number(b.income),
      expense: Number(b.expense),
      balance: Number(b.balance),
    })),
  };
}
