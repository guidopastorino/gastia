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

/**
 * Large centered amount, typed with the decimal keypad. The "$" lives inside the
 * input so the field spans the full width and long amounts never get cut.
 */
export function AmountInput({ value, onChangeText, autoFocus }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="small" tone="secondary" style={styles.label}>
        Monto · USD
      </AppText>
      <TextInput
        value={value ? `$${value}` : ''}
        onChangeText={(t) => onChangeText(t.replace(/[^0-9.,]/g, ''))}
        placeholder="$0"
        placeholderTextColor={colors.textTertiary}
        keyboardType="decimal-pad"
        autoFocus={autoFocus}
        // Shrink a bit for very long amounts so they stay on one line.
        style={[styles.input, value.length > 10 && { fontSize: 36 }]}
        accessibilityLabel="Monto"
      />
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { alignItems: 'stretch', gap: 4, paddingVertical: 12 },
  label: { textAlign: 'center' },
  input: {
    fontFamily: fonts.semibold,
    fontSize: 48,
    letterSpacing: -1.6,
    color: c.text,
    textAlign: 'center',
    padding: 0,
  },
}));
