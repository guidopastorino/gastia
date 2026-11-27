import { View } from 'react-native';

import { AppText, SegmentedControl } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';

export type AdviceLevel = 'conservative' | 'moderate' | 'aggressive';

const OPTIONS = [
  { value: 'conservative', label: 'Conservador' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'aggressive', label: 'Agresivo' },
] as const satisfies readonly { value: AdviceLevel; label: string }[];

const SUMMARY: Record<AdviceLevel, string> = {
  conservative: 'Prudente',
  moderate: 'Equilibrado',
  aggressive: 'Ambicioso',
};

type Props = {
  value: AdviceLevel;
  onChange: (value: AdviceLevel) => void;
};

export function AdviceLevelRow({ value, onChange }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText>Nivel de asesoría financiera</AppText>
        <AppText variant="caption" tone="secondary">
          {SUMMARY[value]}
        </AppText>
      </View>
      <SegmentedControl options={OPTIONS} value={value} onChange={onChange} />
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { gap: 12, padding: 16, backgroundColor: c.card },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
}));
