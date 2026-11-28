import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Screen } from '../../components/layout/Screen';
import { AppText, Button } from '../../components/ui';
import { formatMoney } from '../../lib/format';
import { makeStyles } from '../../theme/makeStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { AuthField } from '../auth/components/AuthField';
import { parseAmount, transferBetweenAccounts } from './api';
import { AccountPicker } from './components/AccountPicker';
import { AmountInput } from './components/AmountInput';
import { useAccounts } from './useAccounts';

export function TransferScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { accounts, error: accountsError } = useAccounts();

  const [amountText, setAmountText] = useState('');
  const [note, setNote] = useState('');
  const [fromPicked, setFromPicked] = useState<string | null>(null);
  const [toPicked, setToPicked] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Defaults: from the first account to the next one.
  const fromId = fromPicked ?? accounts?.[0]?.id ?? null;
  const toId = toPicked ?? accounts?.find((a) => a.id !== fromId)?.id ?? null;
  const from = accounts?.find((a) => a.id === fromId);

  const amount = parseAmount(amountText);
  const exceedsBalance = !!from && !Number.isNaN(amount) && amount > from.balance;
  const canSave = !Number.isNaN(amount) && !exceedsBalance && !!fromId && !!toId && fromId !== toId && !saving;

  function pickFrom(id: string) {
    setFromPicked(id);
    if (id === toId) setToPicked(accounts?.find((a) => a.id !== id)?.id ?? null);
  }

  async function handleSave() {
    if (!canSave || !fromId || !toId) return;
    setSaving(true);
    setError(null);
    try {
      await transferBetweenAccounts({ fromAccountId: fromId, toAccountId: toId, amount, note });
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo hacer la transferencia.');
      setSaving(false);
    }
  }

  if (!accounts) {
    return (
      <Screen>
        {accountsError ? (
          <AppText tone="danger">{accountsError}</AppText>
        ) : (
          <ActivityIndicator color={colors.textSecondary} />
        )}
      </Screen>
    );
  }

  if (accounts.length < 2) {
    return (
      <Screen>
        <AppText tone="secondary">Necesitas al menos dos cuentas para transferir.</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <AmountInput value={amountText} onChangeText={setAmountText} autoFocus />

      <View style={styles.form}>
        <AccountPicker label="Desde" accounts={accounts} value={fromId} onChange={pickFrom} />
        <AccountPicker label="Hacia" accounts={accounts} value={toId} onChange={setToPicked} disabledId={fromId} />
        <AuthField
          label="Nota (opcional)"
          icon="create-outline"
          placeholder="Ej. Ahorro del mes"
          value={note}
          onChangeText={setNote}
          maxLength={120}
          returnKeyType="done"
        />
        {exceedsBalance && from && (
          <AppText variant="small" tone="danger">
            Saldo insuficiente: {from.name} tiene {formatMoney(from.balance)}.
          </AppText>
        )}
        {error && (
          <AppText variant="small" tone="danger">
            {error}
          </AppText>
        )}
      </View>

      <Button title="Transferir" size="lg" loading={saving} disabled={!canSave} onPress={handleSave} />
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  form: { gap: 24 },
}));
