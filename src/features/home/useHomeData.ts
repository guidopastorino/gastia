import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import {
  fetchHomeSummary,
  fetchRecentTransactions,
  type HomeSummary,
  type TransactionRecord,
} from '../finance/api';

type State = {
  summary: HomeSummary | null;
  transactions: TransactionRecord[];
  error: string | null;
};

/** Loads the home numbers and recent movements, and reloads every time the screen gains focus. */
export function useHomeData() {
  const [state, setState] = useState<State>({ summary: null, transactions: [], error: null });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [summary, transactions] = await Promise.all([fetchHomeSummary(), fetchRecentTransactions()]);
      setState({ summary, transactions, error: null });
    } catch (e) {
      setState((s) => ({ ...s, error: e instanceof Error ? e.message : 'No se pudieron cargar tus datos.' }));
    }
  }, []);

  // Coming back from "Ingresar" or "Transferir" shows the new numbers right away.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return { ...state, loading: !state.summary && !state.error, refreshing, refresh };
}
