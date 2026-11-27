import { useId, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { useTheme } from '../../theme/ThemeProvider';
import type { ChartPoint } from '../../types/finance';
import { AppText } from '../ui';

type Props = {
  /** Points with an empty label shape the curve but get no marker or axis label. */
  data: ChartPoint[];
  height?: number;
  /** Draws a dashed baseline at this value. */
  average?: number;
  /** Index of the point to call out with a tooltip. */
  highlightIndex?: number;
  formatValue?: (value: number) => string;
};

const PAD = { top: 36, bottom: 10, x: 8 };
const LABEL_WIDTH = 64;

type Pt = { x: number; y: number };

/** Catmull-Rom spline through the points, as cubic Béziers. */
function smoothPath(pts: Pt[]) {
  if (pts.length < 2) return '';
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function LineChart({ data, height = 190, average, highlightIndex, formatValue = String }: Props) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const gradientId = `line-${useId()}`;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const values = data.map((d) => d.value);
  const min = Math.min(...values, average ?? Infinity);
  const max = Math.max(...values, average ?? -Infinity);
  const range = max - min || 1;
  const plotH = height - PAD.top - PAD.bottom;
  const xAt = (i: number) => PAD.x + (i / Math.max(data.length - 1, 1)) * (width - PAD.x * 2);
  const yAt = (v: number) => PAD.top + (1 - (v - min) / range) * plotH;

  const pts = data.map((d, i) => ({ x: xAt(i), y: yAt(d.value) }));
  const line = smoothPath(pts);
  const area = line && `${line} L${pts[pts.length - 1].x},${height} L${pts[0].x},${height} Z`;

  const highlight = highlightIndex !== undefined ? pts[highlightIndex] : undefined;
  const tooltip = highlightIndex !== undefined ? formatValue(data[highlightIndex].value) : '';
  const tooltipW = tooltip.length * 7.5 + 18;

  return (
    <View>
      <View style={{ height }} onLayout={onLayout}>
        {width > 0 && (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.text} stopOpacity={0.14} />
                <Stop offset="1" stopColor={colors.text} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Path d={area} fill={`url(#${gradientId})`} />
            {average !== undefined && (
              <Line
                x1={0}
                x2={width}
                y1={yAt(average)}
                y2={yAt(average)}
                stroke={colors.textTertiary}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            )}
            <Path d={line} stroke={colors.text} strokeWidth={2.5} fill="none" strokeLinecap="round" />
            {pts.map((p, i) =>
              data[i].label && i !== highlightIndex ? (
                <Circle key={i} cx={p.x} cy={p.y} r={5} fill={colors.card} stroke={colors.text} strokeWidth={2} />
              ) : null,
            )}
            {highlight && (
              <G>
                <Circle cx={highlight.x} cy={highlight.y} r={6} fill={colors.text} />
                <Rect
                  x={Math.min(Math.max(highlight.x - tooltipW / 2, 0), width - tooltipW)}
                  y={highlight.y - 34}
                  width={tooltipW}
                  height={24}
                  rx={10}
                  fill={colors.primary}
                />
                <SvgText
                  x={Math.min(Math.max(highlight.x, tooltipW / 2), width - tooltipW / 2)}
                  y={highlight.y - 17.5}
                  fill={colors.onPrimary}
                  fontSize={12}
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {tooltip}
                </SvgText>
              </G>
            )}
          </Svg>
        )}
      </View>
      <View style={styles.labels}>
        {width > 0 &&
          data.map((d, i) =>
            d.label ? (
              <AppText
                key={i}
                variant="caption"
                tone="secondary"
                style={[
                  styles.label,
                  { left: Math.min(Math.max(xAt(i) - LABEL_WIDTH / 2, 0), width - LABEL_WIDTH) },
                ]}
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
  labels: { height: 20, marginTop: 6 },
  label: { position: 'absolute', width: LABEL_WIDTH, textAlign: 'center' },
});
