import type { IconName } from '../../components/ui';
import type { SavingsGoal } from '../../types/finance';

export type ChatRole = 'assistant' | 'user';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  /** Supports `**bold**`. Paragraphs separated by a blank line. */
  text: string;
  time: string;
  /** Extra context after the time, e.g. "Cuentas sincronizadas". */
  note?: string;
  goal?: SavingsGoal;
};

export type Suggestion = {
  id: string;
  label: string;
  icon: IconName;
};
