import { View } from 'react-native';

import { IconCircle } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';

type Props = {
  size?: number;
  /** Shows a small "online" dot. */
  online?: boolean;
};

export function AssistantAvatar({ size = 32, online }: Props) {
  const styles = useStyles();

  return (
    <View>
      <IconCircle icon="sparkles" size={size} variant="solid" />
      {online && <View style={styles.dot} />}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  dot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: c.success,
    borderWidth: 2,
    borderColor: c.card,
  },
}));
