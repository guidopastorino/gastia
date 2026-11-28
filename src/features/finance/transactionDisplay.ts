import type { IconName } from '../../components/ui';
import { relativeDateTimeLabel, timeLabel } from '../../lib/date';
import type { Transaction } from '../../types/finance';
import type { TransactionKind, TransactionRecord } from './api';

export const KIND_DISPLAY: Record<TransactionKind, { icon: IconName; label: string }> = {
  income: { icon: 'cash-outline', label: 'Ingreso' },
  expense: { icon: 'bag-handle-outline', label: 'Gasto' },
  transfer: { icon: 'swap-horizontal', label: 'Transferencia' },
};

/**
 * Turns a stored movement into what TransactionRow shows.
 * `timeOnly` drops the day from the subtitle, for lists already grouped by day.
 */
export function toTransactionRow(t: TransactionRecord, { timeOnly = false } = {}): Transaction {
  const when = timeOnly ? timeLabel(new Date(t.occurredAt)) : relativeDateTimeLabel(t.occurredAt);
  return {
    id: t.id,
    title: t.title,
    subtitle: `${when} • ${t.accountName}`,
    amount: t.amount,
    method: KIND_DISPLAY[t.kind].label,
    icon: KIND_DISPLAY[t.kind].icon,
  };
}
