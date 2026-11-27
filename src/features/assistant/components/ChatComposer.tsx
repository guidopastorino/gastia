import { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';

import { IconButton } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import { radius } from '../../../theme/tokens';

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatComposer({ onSend, disabled }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0 && !disabled;

  function send() {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon="mic-outline"
        accessibilityLabel="Dictar mensaje"
        onPress={() => Alert.alert('Dictado', 'Próximamente.')}
      />
      <TextInput
        style={styles.input}
        placeholder="Pregúntale a Gastia sobre tus finanzas"
        placeholderTextColor={colors.textTertiary}
        value={text}
        onChangeText={setText}
        onSubmitEditing={send}
        returnKeyType="send"
        multiline
        submitBehavior="submit"
      />
      <IconButton
        icon="add-circle-outline"
        accessibilityLabel="Adjuntar"
        onPress={() => Alert.alert('Adjuntar', 'Próximamente.')}
      />
      <IconButton
        icon="arrow-up"
        variant="primary"
        accessibilityLabel="Enviar"
        onPress={send}
        style={!canSend && { opacity: 0.4 }}
      />
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 6,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: radius.lg,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.separator,
  },
  input: { flex: 1, fontSize: 16, color: c.text, maxHeight: 110, paddingVertical: 8 },
}));
