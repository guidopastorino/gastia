import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Screen } from '../../components/layout/Screen';
import { AppText, Button } from '../../components/ui';
import { makeStyles } from '../../theme/makeStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { AuthField } from '../auth/components/AuthField';
import { addIncome, parseAmount } from './api';
import { AccountPicker } from './components/AccountPicker';
import { AmountInput } from './components/AmountInput';
import { useAccounts } from './useAccounts';

export function AddIncomeScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { accounts, error: accountsError } = useAccounts();

  const [amountText, setAmountText] = useState('');
  const [title, setTitle] = useState('');
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accountId = pickedId ?? accounts?.[0]?.id ?? null;
  const amount = parseAmount(amountText);
  const canSave = !Number.isNaN(amount) && !!accountId && !saving;

  async function handleSave() {
    if (!canSave || !accountId) return;
    setSaving(true);
    setError(null);
    try {
      await addIncome({ accountId, amount, title: title.trim() || 'Ingreso' });
      navigation.goBack();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo registrar el ingreso.');
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

  return (
    <Screen>
      <AmountInput value={amountText} onChangeText={setAmountText} autoFocus />

      <View style={styles.form}>
        <AuthField
          label="Concepto"
          icon="create-outline"
          placeholder="Sueldo, venta, regalo…"
          value={title}
          onChangeText={setTitle}
          maxLength={120}
          returnKeyType="done"
        />
        <AccountPicker label="Cuenta" accounts={accounts} value={accountId} onChange={setPickedId} />
        {error && (
          <AppText variant="small" tone="danger">
            {error}
          </AppText>
        )}
      </View>

      <Button title="Registrar ingreso" size="lg" loading={saving} disabled={!canSave} onPress={handleSave} />
    </Screen>
  );
}

const useStyles = makeStyles(() => ({
  form: { gap: 24 },
}));
