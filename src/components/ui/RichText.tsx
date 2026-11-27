import { Text } from 'react-native';

import { AppText, type TextTone, type TextVariant } from './AppText';

type Props = {
  /** Text where `**segments**` render bold. */
  children: string;
  variant?: TextVariant;
  tone?: TextTone;
};

export function RichText({ children, variant = 'body', tone }: Props) {
  const parts = children.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <AppText variant={variant} tone={tone}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Text key={i} style={{ fontWeight: '700' }}>
            {part.slice(2, -2)}
          </Text>
        ) : (
          part
        ),
      )}
    </AppText>
  );
}
