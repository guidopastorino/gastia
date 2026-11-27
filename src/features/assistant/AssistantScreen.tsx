import { useEffect, useRef, useState } from 'react';
import { type ScrollViewInstance } from 'react-native';

import { useAuth } from '../../auth/AuthProvider';
import { Screen } from '../../components/layout/Screen';
import { AppText } from '../../components/ui';
import { timeLabel } from '../../lib/date';
import { getFirstName } from '../../lib/user';
import { ChatBubble } from './components/ChatBubble';
import { ChatComposer } from './components/ChatComposer';
import { SuggestionChips } from './components/SuggestionChips';
import { demoReply, initialMessages, suggestions } from './mock';
import type { ChatMessage } from './types';

const REPLY_DELAY_MS = 900;

export function AssistantScreen() {
  const { session } = useAuth();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialMessages(getFirstName(session?.user)),
  );
  const [replying, setReplying] = useState(false);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
  }, []);

  function send(text: string) {
    const now = timeLabel();
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text, time: now }]);
    setReplying(true);

    // UI-only: canned reply until the assistant is connected to a model.
    replyTimer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: demoReply, time: timeLabel() },
      ]);
      setReplying(false);
    }, REPLY_DELAY_MS);
  }

  return (
    <Screen
      scrollRef={scrollRef}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
    >
      {messages.map((m) => (
        <ChatBubble key={m.id} message={m} />
      ))}

      {replying && (
        <AppText variant="small" tone="tertiary">
          Gastia está escribiendo…
        </AppText>
      )}

      <SuggestionChips suggestions={suggestions} onSelect={(s) => send(s.label)} />

      <ChatComposer onSend={send} disabled={replying} />

      <AppText variant="caption" tone="tertiary" style={{ textAlign: 'center' }}>
        Gastia IA puede cometer errores. Verifica la información importante.
      </AppText>
    </Screen>
  );
}
