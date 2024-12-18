// @flow

import React from 'react';
import {
  ResponsiveContainer,
  Bar,
  Line,
  ComposedChart as ComposedChartBase,
  YAxis,
  XAxis,
  Area,
  CartesianGrid,
} from 'recharts';

import { colors as bsportColors } from '@bsport/common/lib/colors';

type Props = {
  height: number,
  data: any,
  color: 'blue' | 'blueLight' | 'yellow' | 'red',
  xKey: Object,
  yKey: Object,
  xFormatter: Object,
  domain: Object,
};

const colors = {
  darkBackground: {
    fill: 'rgba(255,255,255,0.4)',
    stroke: 'rgba(255,255,255,0.5)',
  },
  green: {
    fill: bsportColors.primary,
  },
  marine: {
    fill: bsportColors.secondaryDark,
  },
  blue: {
    fill: bsportColors.secondary,
    stroke: bsportColors.secondary,
  },
  blueLight: {
    fill: '#9BD1E8',
    stroke: '#9BE1E8',
  },
  yellow: {
    stroke: '#FBE4B1',
    fill: '#F9CE69',
  },
  red: {
    fill: bsportColors.orange,
    stroke: bsportColors.orange,
  },
};
function getStyle(color) {
  return colors[color || bsportColors.secondary] || colors.green;
}

type BarChartProps = Props;

export const ComposedChart = React.memo((props: BarChartProps) => {
  const {
    height,
    data,
    xKey,
    yKey,
    color,
    xFormatter,
    yFormatter,
    yLabel,
    continuous,
  } = props;
  return (
    <ResponsiveContainer key={Math.random()} height={height} width="100%">
      <ComposedChartBase
        data={data}
        margin={{ top: 40, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickFormatter={xFormatter} />
        <YAxis
          dataKey={yKey}
          label={{
            value: yLabel,
            position: 'insideLeft',
            angle: -90,
          }}
        />
        {continuous ? (
          <Area
            dataKey={yKey}
            fill={color}
            fillOpacity={0.7}
            isAnimationActive={false}
            stroke={false}
            type="monotone"
          />
        ) : (
          <Bar
            barSize={40}
            dataKey={yKey}
            fill={getStyle(color).fill}
            label={{ position: 'top', formatter: yFormatter }}
            name={props.label}
          />
        )}
        {continuous ? null : (
          <Line dataKey={yKey} stroke={getStyle(color).fill} type="monotone" />
        )}
      </ComposedChartBase>
    </ResponsiveContainer>
  );
});
