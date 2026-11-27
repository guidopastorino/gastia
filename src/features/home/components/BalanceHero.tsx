import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '../../../components/ui';
import { formatMoney, formatPercent } from '../../../lib/format';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  greeting: string;
  total: number;
  currency: string;
  changePct: number;
  changeAmount: number;
};

export function BalanceHero({ greeting, total, currency, changePct, changeAmount }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(false);
  const up = changePct >= 0;

  return (
    <View style={styles.container}>
      <AppText tone="secondary">{greeting}</AppText>

      <View style={styles.block}>
        <Pressable
          onPress={() => setHidden((h) => !h)}
          hitSlop={10}
          style={styles.labelRow}
          accessibilityRole="button"
          accessibilityLabel={hidden ? 'Mostrar balance' : 'Ocultar balance'}
        >
          <AppText variant="small" tone="secondary">
            Balance total · {currency}
          </AppText>
          <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={16} color={colors.textSecondary} />
        </Pressable>

        <AppText variant="display" adjustsFontSizeToFit numberOfLines={1}>
          {hidden ? '••••••' : formatMoney(total)}
        </AppText>

        <View style={styles.trendRow}>
          <Ionicons name={up ? 'arrow-up' : 'arrow-down'} size={14} color={up ? colors.success : colors.danger} />
          <AppText variant="smallStrong" tone={up ? 'success' : 'danger'}>
            {formatPercent(changePct, { signed: false })}
          </AppText>
          <AppText variant="small" tone="secondary">
            {hidden ? 'este mes' : `${formatMoney(changeAmount, { signed: true, decimals: 0 })} este mes`}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: { gap: 20 },
  block: { gap: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
}));
