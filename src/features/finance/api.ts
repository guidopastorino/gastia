import type { IconName } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export type Account = {
  id: string;
  name: string;
  icon: IconName;
};

export type TransactionKind = 'income' | 'expense' | 'transfer';

export type TransactionRecord = {
  id: string;
  kind: TransactionKind;
  /** Signed: positive adds money to the account, negative takes it out. */
  amount: number;
  title: string;
  occurredAt: string;
  accountName: string;
};

export type HomeSummary = {
  balance: number;
  /** Income minus expenses this month (transfers excluded). */
  monthNet: number;
  incomeMonth: number;
  incomePrevMonth: number;
  expensesMonth: number;
  expensesPrevMonth: number;
  /** Income of the last 6 months, oldest first. */
  incomeTrend: number[];
};

type SummaryRow = {
  balance: number;
  month_net: number;
  income_month: number;
  income_prev_month: number;
  expenses_month: number;
  expenses_prev_month: number;
  income_trend: number[] | null;
};

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase.from('accounts').select('id, name, icon').order('created_at');
  if (error) throw error;
  return data.map((a) => ({ id: a.id, name: a.name, icon: a.icon as IconName }));
}

export async function fetchHomeSummary(): Promise<HomeSummary> {
  const { data, error } = await supabase.rpc('get_home_summary');
  if (error) throw error;
  const s = data as unknown as SummaryRow;
  return {
    balance: Number(s.balance),
    monthNet: Number(s.month_net),
    incomeMonth: Number(s.income_month),
    incomePrevMonth: Number(s.income_prev_month),
    expensesMonth: Number(s.expenses_month),
    expensesPrevMonth: Number(s.expenses_prev_month),
    incomeTrend: (s.income_trend ?? []).map(Number),
  };
}

export async function fetchRecentTransactions(limit = 5): Promise<TransactionRecord[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('id, kind, amount, title, occurred_at, account:accounts(name)')
    .order('occurred_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map((t) => ({
    id: t.id,
    kind: t.kind as TransactionKind,
    amount: Number(t.amount),
    title: t.title,
    occurredAt: t.occurred_at,
    accountName: t.account?.name ?? '',
  }));
}

export async function addIncome(input: { accountId: string; amount: number; title: string }) {
  const { error } = await supabase.from('transactions').insert({
    account_id: input.accountId,
    kind: 'income',
    amount: Math.round(input.amount * 100) / 100,
    title: input.title,
  });
  if (error) throw error;
}

export async function transferBetweenAccounts(input: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
}) {
  const { error } = await supabase.rpc('transfer_between_accounts', {
    p_from_account_id: input.fromAccountId,
    p_to_account_id: input.toAccountId,
    p_amount: input.amount,
    p_note: input.note,
  });
  if (error) throw error;
}

/** "1.234,5" or "1234.50" -> 1234.5; NaN when it isn't a positive amount. */
export function parseAmount(text: string) {
  const cleaned = text.trim().replace(/\s/g, '');
  // Treat the last "," or "." as the decimal separator and drop the others.
  const lastSep = Math.max(cleaned.lastIndexOf(','), cleaned.lastIndexOf('.'));
  const normalized =
    lastSep === -1
      ? cleaned
      : cleaned.slice(0, lastSep).replace(/[.,]/g, '') + '.' + cleaned.slice(lastSep + 1);
  const value = Number(normalized);
  return Number.isFinite(value) && value > 0 ? value : NaN;
}
