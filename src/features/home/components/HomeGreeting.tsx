import { Alert, View } from 'react-native';

import { AppText, Chip, IconButton } from '../../../components/ui';
import { greetingForHour, monthLabel } from '../../../lib/date';
import { makeStyles } from '../../../theme/makeStyles';

type Props = {
  firstName: string;
};

export function HomeGreeting({ firstName }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <Chip label="IA activa y sincronizada" dot />
        <AppText variant="caption" tone="secondary">
          {monthLabel()}
        </AppText>
      </View>
      <View style={styles.titleRow}>
        <AppText variant="title" style={styles.title} numberOfLines={2}>
          {greetingForHour()}, {firstName}
        </AppText>
        <IconButton
          icon="options-outline"
          accessibilityLabel="Personalizar inicio"
          onPress={() => Alert.alert('Personalizar inicio', 'Próximamente.')}
        />
      </View>
    </View>
  );
}

const useStyles = makeStyles(() => ({
  container: { gap: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1 },
}));
