// @flow

import * as React from 'react';
import {
  BarChart as BarChartBase,
  ResponsiveContainer,
  Bar,
  Legend,
  Tooltip,
  YAxis,
  XAxis,
  CartesianGrid,
} from 'recharts';

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
    fill: '#469B7C',
  },
  marine: {
    fill: '#3f5a96',
  },
  blue: {
    fill: '#9BD1E8',
    stroke: '#9BD1E8',
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
    fill: '#ED908D',
    stroke: '#F99B99',
  },
};
function getStyle(color) {
  return colors[color || 'blue'] || colors.green;
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
        <Bar dataKey={yKey} fill={style.fill} />
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
        <Tooltip labelFormatter={xFormatter} formatter={yFormatter} />
        <Legend />
        <Bar
          dataKey={yKey}
          fill={getStyle(color).fill}
          name={props.label}
          label={{ position: 'top', formatter: yFormatter }}
        />
      </BarChartBase>
    </ResponsiveContainer>
  );
}
