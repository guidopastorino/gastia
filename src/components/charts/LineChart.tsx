import { useId, useState } from 'react';
import { StyleSheet, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { useTheme } from '../../theme/ThemeProvider';
import type { ChartPoint } from '../../types/finance';
import { AppText } from '../ui';
import { monotonePath } from './path';

type Props = {
  /** Points with an empty label shape the curve but get no axis label. */
  data: ChartPoint[];
  height?: number;
  /** Draws a dashed baseline at this value. */
  average?: number;
  /** Initially selected point (e.g. the peak). Defaults to the last one. */
  initialIndex?: number;
  formatValue?: (value: number) => string;
};

const PAD = { top: 44, bottom: 8, x: 6 };
const GRID_LINES = 3;
const LABEL_WIDTH = 56;
const TOOLTIP_WIDTH = 128;

/** Interactive line chart: touch or drag to inspect a point. */
export function LineChart({ data, height = 200, average, initialIndex, formatValue = String }: Props) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(initialIndex ?? data.length - 1);
  const gradientId = `line-${useId()}`;

  const values = data.map((d) => d.value);
  const rawMin = Math.min(...values, average ?? Infinity);
  const rawMax = Math.max(...values, average ?? -Infinity);
  // Breathing room so the curve never touches the top or bottom edge.
  const span = rawMax - rawMin || 1;
  const min = rawMin - span * 0.08;
  const max = rawMax + span * 0.08;

  const plotH = height - PAD.top - PAD.bottom;
  const xAt = (i: number) => PAD.x + (i / Math.max(data.length - 1, 1)) * (width - PAD.x * 2);
  const yAt = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * plotH;

  const pts = data.map((d, i) => ({ x: xAt(i), y: yAt(d.value) }));
  const line = width > 0 ? monotonePath(pts) : '';
  const area = line && `${line} L${pts[pts.length - 1].x},${height} L${pts[0].x},${height} Z`;

  const activePoint = pts[active];
  const activeData = data[active];

  function selectAt(e: GestureResponderEvent) {
    if (width === 0 || data.length < 2) return;
    const step = (width - PAD.x * 2) / (data.length - 1);
    const i = Math.round((e.nativeEvent.locationX - PAD.x) / step);
    setActive(Math.max(0, Math.min(data.length - 1, i)));
  }

  const tooltipLeft = activePoint
    ? Math.min(Math.max(activePoint.x - TOOLTIP_WIDTH / 2, 0), width - TOOLTIP_WIDTH)
    : 0;

  return (
    <View>
      <View
        style={{ height }}
        onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={selectAt}
        onResponderMove={selectAt}
        onResponderTerminationRequest={() => true}
        accessibilityRole="adjustable"
        accessibilityLabel="Gráfico de gastos"
        accessibilityValue={activeData ? { text: `${activeData.label || ''} ${formatValue(activeData.value)}` } : undefined}
      >
        {width > 0 && (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.text} stopOpacity={0.1} />
                <Stop offset="1" stopColor={colors.text} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {Array.from({ length: GRID_LINES }, (_, i) => {
              const y = PAD.top + (plotH / (GRID_LINES - 1)) * i;
              return <Line key={i} x1={0} x2={width} y1={y} y2={y} stroke={colors.separator} strokeWidth={1} />;
            })}

            <Path d={area} fill={`url(#${gradientId})`} />

            {average !== undefined && (
              <Line
                x1={0}
                x2={width}
                y1={yAt(average)}
                y2={yAt(average)}
                stroke={colors.textTertiary}
                strokeWidth={1}
                strokeDasharray="3 5"
              />
            )}

            <Path d={line} stroke={colors.text} strokeWidth={2} fill="none" strokeLinecap="round" />

            {activePoint && (
              <>
                <Line
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1={activePoint.y}
                  y2={height}
                  stroke={colors.textTertiary}
                  strokeWidth={1}
                  strokeDasharray="2 4"
                />
                <Circle cx={activePoint.x} cy={activePoint.y} r={9} fill={colors.text} opacity={0.12} />
                <Circle cx={activePoint.x} cy={activePoint.y} r={4.5} fill={colors.text} stroke={colors.card} strokeWidth={2} />
              </>
            )}
          </Svg>
        )}

        {activePoint && activeData && (
          <View
            pointerEvents="none"
            style={[styles.tooltip, { left: tooltipLeft, backgroundColor: colors.primary }]}
          >
            <AppText variant="smallStrong" tone="inverse" numberOfLines={1}>
              {activeData.label ? `${activeData.label} · ${formatValue(activeData.value)}` : formatValue(activeData.value)}
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.labels}>
        {width > 0 &&
          data.map((d, i) =>
            d.label ? (
              <AppText
                key={i}
                variant="caption"
                tone={i === active ? 'default' : 'tertiary'}
                style={[styles.label, { left: Math.min(Math.max(xAt(i) - LABEL_WIDTH / 2, 0), width - LABEL_WIDTH) }]}
              >
                {d.label}
              </AppText>
            ) : null,
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    top: 0,
    width: TOOLTIP_WIDTH,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 999,
  },
  labels: { height: 18, marginTop: 10 },
  label: { position: 'absolute', width: LABEL_WIDTH, textAlign: 'center' },
});
