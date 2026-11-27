import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type Ref } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { AppText, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import { radius } from '../../../theme/tokens';

type Props = Omit<TextInputProps, 'ref'> & {
  ref?: Ref<TextInputInstance>;
  label: string;
  icon: IconName;
  /** Link shown at the right of the label, e.g. "¿Olvidaste tu contraseña?". */
  labelAction?: { text: string; onPress: () => void };
  /** Renders a show/hide toggle and hides the text by default. */
  secure?: boolean;
};

export function AuthField({ ref, label, icon, labelAction, secure, style, ...inputProps }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <AppText variant="small">{label}</AppText>
        {labelAction && (
          <Pressable onPress={labelAction.onPress} hitSlop={8}>
            <AppText variant="caption">{labelAction.text}</AppText>
          </Pressable>
        )}
      </View>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={20} color={colors.icon} />
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secure && hidden}
          {...inputProps}
        />
        {secure && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={21} color={colors.icon} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { gap: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: c.surface,
  },
  input: { flex: 1, height: '100%', fontSize: 16, color: c.text },
}));
