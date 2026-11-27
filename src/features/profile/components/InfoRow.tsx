import { View } from 'react-native';

import { AppText, IconCircle, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';

type Props = {
  icon: IconName;
  label: string;
  value: string;
};

/** Read-only field: small label above a selectable value. */
export function InfoRow({ icon, label, value }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <IconCircle icon={icon} size={36} />
      <View style={styles.texts}>
        <AppText variant="caption" tone="tertiary">
          {label}
        </AppText>
        <AppText selectable numberOfLines={2}>
          {value || '—'}
        </AppText>
      </View>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: c.card,
  },
  texts: { flex: 1, gap: 2 },
}));
