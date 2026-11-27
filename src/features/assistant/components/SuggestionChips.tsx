import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';
import { radius } from '../../../theme/tokens';
import type { Suggestion } from '../types';

type Props = {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
};

export function SuggestionChips({ suggestions, onSelect }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="overline" tone="secondary">
          Sugerencias inteligentes
        </AppText>
        <AppText variant="caption" tone="secondary">
          Desliza →
        </AppText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        // Bleed to the screen edges so chips scroll under the page padding.
        style={styles.scroller}
      >
        {suggestions.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => onSelect(s)}
            style={({ pressed }) => [styles.chip, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name={s.icon} size={18} color={colors.icon} />
            <AppText variant="small">{s.label}</AppText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { gap: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  scroller: { marginHorizontal: -16 },
  list: { gap: 8, paddingHorizontal: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: radius.pill,
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.separator,
  },
}));
