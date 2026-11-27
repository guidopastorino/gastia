import { useId, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { useTheme } from '../../theme/ThemeProvider';

type Props = {
  data: number[];
  height?: number;
  color?: string;
};

/** Minimal trend line with a soft gradient fill underneath. */
export function Sparkline({ data, height = 44, color }: Props) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const gradientId = `spark-${useId()}`;
  const stroke = color ?? colors.text;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  let line = '';
  let area = '';
  if (width > 0 && data.length > 1) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = 3;
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * width,
      y: pad + (1 - (v - min) / range) * (height - pad * 2),
    }));
    line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    area = `${line} L${width},${height} L0,${height} Z`;
  }

  return (
    <View style={{ height }} onLayout={onLayout}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={stroke} stopOpacity={0.16} />
              <Stop offset="1" stopColor={stroke} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={area} fill={`url(#${gradientId})`} />
          <Path d={line} stroke={stroke} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </Svg>
      )}
    </View>
  );
}
