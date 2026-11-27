import { Children, Fragment, type ReactNode } from 'react';
import { View } from 'react-native';

import { makeStyles } from '../../theme/makeStyles';
import { AppText } from './AppText';
import { Card } from './Card';
import { LIST_ROW_GAP, LIST_ROW_ICON_SIZE, LIST_ROW_PADDING } from './ListRow';

type Props = {
  title?: string;
  footer?: string;
  /** Inset separators to align with row text (rows with icons). */
  inset?: boolean;
  children: ReactNode;
};

/** Grouped card of rows with hairline separators, like iOS Settings. */
export function ListSection({ title, footer, inset = true, children }: Props) {
  const styles = useStyles();
  const rows = Children.toArray(children);

  return (
    <View style={styles.container}>
      {title && (
        <AppText variant="overline" tone="tertiary" style={styles.title}>
          {title}
        </AppText>
      )}
      <Card padded={false}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 && <View style={[styles.separator, inset && styles.inset]} />}
            {row}
          </Fragment>
        ))}
      </Card>
      {footer && (
        <AppText variant="caption" tone="tertiary" style={styles.title}>
          {footer}
        </AppText>
      )}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  container: { gap: 10 },
  title: { paddingHorizontal: LIST_ROW_PADDING },
  separator: { height: 1, backgroundColor: c.separator },
  inset: { marginLeft: LIST_ROW_PADDING + LIST_ROW_ICON_SIZE + LIST_ROW_GAP },
}));
