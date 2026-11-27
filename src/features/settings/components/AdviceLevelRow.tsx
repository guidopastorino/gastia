import { View } from 'react-native';

import { AppText, SegmentedControl } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';

export type AdviceLevel = 'conservative' | 'moderate' | 'aggressive';

const OPTIONS = [
  { value: 'conservative', label: 'Conservador' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'aggressive', label: 'Agresivo' },
] as const satisfies readonly { value: AdviceLevel; label: string }[];

type Props = {
  value: AdviceLevel;
  onChange: (value: AdviceLevel) => void;
};

export function AdviceLevelRow({ value, onChange }: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <AppText>Nivel de asesoría</AppText>
        <AppText variant="caption" tone="secondary">
          Qué tan arriesgadas son las sugerencias
        </AppText>
      </View>
      <SegmentedControl options={OPTIONS} value={value} onChange={onChange} />
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { gap: 14, paddingHorizontal: 18, paddingVertical: 16, backgroundColor: c.card },
  texts: { gap: 2 },
}));
