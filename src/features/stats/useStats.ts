import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

import { fetchStats, type Period, type Stats } from './api';

type Loaded = { period: Period; stats: Stats | null; error: string | null };

/** Stats for the selected period; reloads when the tab gains focus (new movements may exist). */
export function useStats(period: Period) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const stats = await fetchStats(period);
      if (id === requestId.current) setLoaded({ period, stats, error: null });
    } catch (e) {
      if (id === requestId.current) {
        setLoaded((prev) => ({
          period,
          // Keep showing the previous numbers of this period if a reload fails.
          stats: prev?.period === period ? prev.stats : null,
          error: e instanceof Error ? e.message : 'No se pudieron cargar las estadísticas.',
        }));
      }
    }
  }, [period]);

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

  const current = loaded?.period === period ? loaded : null;
  return {
    stats: current?.stats ?? null,
    error: current?.error ?? null,
    loading: !current,
    refreshing,
    refresh,
  };
}
