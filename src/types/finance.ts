import type { IconName } from '../components/ui';

export type Transaction = {
  id: string;
  title: string;
  /** e.g. "Hoy, 11:34 AM • Alimentación" */
  subtitle: string;
  /** Negative for expenses, positive for income. */
  amount: number;
  /** Payment method or reference shown under the amount. */
  method: string;
  icon: IconName;
  tag?: string;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  amount: number;
  /** 0..1 share of total expenses. */
  share: number;
  icon: IconName;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type SavingsGoal = {
  title: string;
  status: string;
  saved: number;
  target: number;
  icon: IconName;
};
