import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native';

import { AppText, Card } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = {
  title: string;
  text: string;
  onApply: () => void;
  onDismiss: () => void;
};

export function RecommendationCard({ title, text, onApply, onDismiss }: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={16} color={colors.text} />
        <AppText variant="smallStrong" style={styles.title}>
          {title}
        </AppText>
        <Pressable onPress={onDismiss} hitSlop={10} accessibilityRole="button" accessibilityLabel="Descartar">
          <Ionicons name="close" size={18} color={colors.textTertiary} />
        </Pressable>
      </View>
      <AppText tone="secondary">{text}</AppText>
      <Pressable onPress={onApply} hitSlop={8} style={styles.apply} accessibilityRole="button">
        <AppText variant="smallStrong">Aplicar sugerencia</AppText>
        <Ionicons name="arrow-forward" size={15} color={colors.text} />
      </Pressable>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1 },
  apply: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginTop: 4 },
}));
