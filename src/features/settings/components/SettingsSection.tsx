import { Children, Fragment, type ReactNode } from 'react';
import { View } from 'react-native';

import { Card, SectionHeader, type IconName } from '../../../components/ui';
import { makeStyles } from '../../../theme/makeStyles';

type Props = {
  title: string;
  icon?: IconName;
  children: ReactNode;
};

/** Titled card whose children are rendered as rows with separators between them. */
export function SettingsSection({ title, icon, children }: Props) {
  const styles = useStyles();
  const rows = Children.toArray(children);

  return (
    <View style={styles.container}>
      <SectionHeader title={title} icon={icon} />
      <Card padded={false}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 && <View style={styles.separator} />}
            {row}
          </Fragment>
        ))}
      </Card>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { gap: 10 },
  separator: { height: 1, backgroundColor: c.separator },
}));
