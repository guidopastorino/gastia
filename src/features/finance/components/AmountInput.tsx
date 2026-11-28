import { TextInput, View } from 'react-native';

import { AppText } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import { fonts } from '../../../theme/typography';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
};

/** Large centered amount, typed with the decimal keypad. */
export function AmountInput({ value, onChangeText, autoFocus }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="small" tone="secondary">
        Monto · USD
      </AppText>
      <View style={styles.row}>
        <AppText variant="display" tone={value ? 'default' : 'tertiary'}>
          $
        </AppText>
        <TextInput
          value={value}
          onChangeText={(t) => onChangeText(t.replace(/[^0-9.,]/g, ''))}
          placeholder="0"
          placeholderTextColor={colors.textTertiary}
          keyboardType="decimal-pad"
          autoFocus={autoFocus}
          style={styles.input}
          accessibilityLabel="Monto"
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { alignItems: 'center', gap: 4, paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  input: {
    fontFamily: fonts.semibold,
    fontSize: 48,
    letterSpacing: -1.6,
    color: c.text,
    minWidth: 40,
    padding: 0,
  },
}));
