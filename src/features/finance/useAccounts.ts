import { useEffect, useState } from 'react';

import { fetchAccounts, type Account } from './api';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts()
      .then(setAccounts)
      .catch((e) => setError(e instanceof Error ? e.message : 'No se pudieron cargar tus cuentas.'));
  }, []);

  return { accounts, error };
}
