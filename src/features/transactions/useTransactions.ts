import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchTransactions, type TransactionKind, type TransactionRecord } from '../finance/api';

const PAGE_SIZE = 30;

type Loaded = {
  /** Filter these items belong to; while it differs from the current one, the list is loading. */
  kind: TransactionKind | undefined;
  items: TransactionRecord[];
  hasMore: boolean;
  error: string | null;
};

const message = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

/** Paginated movements, newest first. Changing `kind` starts over from the first page. */
export function useTransactions(kind: TransactionKind | undefined) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // Responses for an older filter are dropped when they arrive late.
  const requestId = useRef(0);

  const loadFirstPage = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const page = await fetchTransactions({ kind, offset: 0, limit: PAGE_SIZE });
      if (id === requestId.current) {
        setLoaded({ kind, items: page, hasMore: page.length === PAGE_SIZE, error: null });
      }
    } catch (e) {
      if (id === requestId.current) {
        setLoaded({ kind, items: [], hasMore: false, error: message(e, 'No se pudieron cargar los movimientos.') });
      }
    }
  }, [kind]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const current = loaded?.kind === kind ? loaded : null;
  const items = current?.items ?? [];

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadFirstPage();
    setRefreshing(false);
  }, [loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (!current || loadingMore || !current.hasMore || current.error) return;
    const id = requestId.current;
    setLoadingMore(true);
    try {
      const page = await fetchTransactions({ kind, offset: current.items.length, limit: PAGE_SIZE });
      if (id === requestId.current) {
        setLoaded((prev) =>
          prev && {
            ...prev,
            items: [...prev.items, ...page.filter((t) => !prev.items.some((p) => p.id === t.id))],
            hasMore: page.length === PAGE_SIZE,
          },
        );
      }
    } catch (e) {
      if (id === requestId.current) {
        setLoaded((prev) => prev && { ...prev, error: message(e, 'No se pudieron cargar más movimientos.') });
      }
    } finally {
      setLoadingMore(false);
    }
  }, [kind, current, loadingMore]);

  return {
    items,
    loading: !current,
    loadingMore,
    refreshing,
    error: current?.error ?? null,
    refresh,
    loadMore,
  };
}
