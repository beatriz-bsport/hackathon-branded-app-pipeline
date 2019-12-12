// @flow

import * as React from 'react';
import {
  BarChart as BarChartBase,
  ResponsiveContainer,
  Bar,
  Legend,
  Line,
  ComposedChart as ComposedChartBase,
  YAxis,
  XAxis,
  CartesianGrid,
} from 'recharts';

import { colors as bsportColors } from '@bsport/common/lib/colors';

type Props = {
  height: number,
  data: *,
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

export function SimpleBarChart(props: Props) {
  const { height, data, color, xKey, yKey, xFormatter, domain } = props;
  const style = getStyle(color);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChartBase
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis dataKey={xKey} domain={domain} tickFormatter={xFormatter} hide />
        <YAxis dataKey={yKey} hide />
        <Bar dataKey={yKey} fill={style.fill} barSize={30} />
      </BarChartBase>
    </ResponsiveContainer>
  );
}

type BarChartProps = Props;

export function BarChart(props: BarChartProps) {
  const {
    height,
    data,
    xKey,
    yKey,
    color,
    domain,
    xFormatter,
    yFormatter,
  } = props;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChartBase
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} domain={domain} tickFormatter={xFormatter} />
        <YAxis dataKey={yKey} />
        <Legend />
        <Bar
          dataKey={yKey}
          fill={getStyle(color).fill}
          barSize={60}
          name={props.label}
          label={{ stroke: 'white', position: 'center', formatter: yFormatter }}
        />
      </BarChartBase>
    </ResponsiveContainer>
  );
}

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
  } = props;
  return (
    <ResponsiveContainer key={Math.random()} width="100%" height={height}>
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
        <Bar
          dataKey={yKey}
          fill={getStyle(color).fill}
          barSize={40}
          name={props.label}
          label={{ position: 'top', formatter: yFormatter }}
        />
        <Line type="monotone" dataKey={yKey} stroke={getStyle(color).fill} />
      </ComposedChartBase>
    </ResponsiveContainer>
  );
});
