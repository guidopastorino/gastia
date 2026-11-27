import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { AppText, RichText } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import type { ChatMessage } from '../types';
import { AssistantAvatar } from './AssistantAvatar';
import { GoalCard } from './GoalCard';

type Props = {
  message: ChatMessage;
};

export function ChatBubble({ message }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();
  const [liked, setLiked] = useState(false);
  const isUser = message.role === 'user';
  const paragraphs = message.text.split(/\n\s*\n/);
  const meta = [message.time, message.note].filter(Boolean).join(' • ');

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {!isUser && <AssistantAvatar size={30} />}
      <View style={[styles.column, isUser && styles.columnUser]}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          {paragraphs.map((p, i) => (
            <RichText key={i} tone={isUser ? 'inverse' : 'default'}>
              {p}
            </RichText>
          ))}
          {message.goal && <GoalCard goal={message.goal} />}
        </View>

        <View style={[styles.metaRow, isUser && styles.metaRowUser]}>
          <AppText variant="caption" tone="tertiary">
            {meta}
          </AppText>
          {isUser && <Ionicons name="checkmark-done" size={14} color={colors.textTertiary} />}
          {!isUser && message.note && (
            <View style={styles.actions}>
              <Pressable onPress={() => setLiked((l) => !l)} hitSlop={8} accessibilityLabel="Me sirvió">
                <Ionicons name={liked ? 'thumbs-up' : 'thumbs-up-outline'} size={17} color={colors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={() => Alert.alert('Copiar', 'Próximamente.')}
                hitSlop={8}
                accessibilityLabel="Copiar respuesta"
              >
                <Ionicons name="copy-outline" size={17} color={colors.textSecondary} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  rowUser: { justifyContent: 'flex-end' },
  column: { flexShrink: 1, maxWidth: '84%', gap: 8 },
  columnUser: { alignItems: 'flex-end' },
  bubble: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: 22, gap: 12 },
  bubbleAssistant: { backgroundColor: c.card, borderTopLeftRadius: 8 },
  bubbleUser: { backgroundColor: c.primary, borderBottomRightRadius: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4 },
  metaRowUser: { justifyContent: 'flex-end' },
  actions: { flexDirection: 'row', gap: 16, marginLeft: 'auto' },
}));
