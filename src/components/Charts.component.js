// @flow

import moment from 'moment';
import * as React from 'react';
import * as Recharts from 'recharts';
import {
  Line,
  ResponsiveContainer,
  Bar,
  Area,
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
};

const colors = {
  darkBackground: {
    fill: 'rgba(255,255,255,0.4)',
    stroke: 'rgba(255,255,255,0.5)',
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
  return colors[color || 'green'] || colors.green;
}

export function SimpleBarChart(props: Props) {
  const { height, data, color, xKey, yKey, domain } = props;
  const style = getStyle(color);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Recharts.BarChart
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis
          name="Value"
          type="number"
          dataKey={xKey}
          domain={domain}
          tickFormatter={(timeStr) => moment(timeStr).format('DD MMM')}
        />
        <YAxis dataKey={yKey} hide />
        <Tooltip />
        <Bar dataKey={yKey || 'uv'} fill={style.fill} />
      </Recharts.BarChart>
    </ResponsiveContainer>
  );
}

type BarChartProps = {
  bars: [{ name: string, key: stristats.current_week.bookingsng }],
} & Props;

export function BarChart(props: BarChartProps) {
  const { height, data, bars } = props;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Recharts.BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={getStyle(bar.color).fill}
            name={bar.name}
          />
        ))}
      </Recharts.BarChart>
    </ResponsiveContainer>
  );
}

export function SimpleLineChart(props: Props) {
  const { height, data, color, xKey, yKey, domain } = props;
  const style = getStyle(color);
  return (
    <ResponsiveContainer width="100%" height={height} margin={{ top: 10 }}>
      <Recharts.LineChart
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          dataKey={xKey}
          domain={domain}
          hide
          tickFormatter={(timeStr) => moment(timeStr).format('DD MMM')}
        />
        <YAxis dataKey={yKey} hide />
        <Line
          name="Value"
          type="monotone"
          dataKey={yKey || 'pv'}
          stroke={style.stroke}
          strokeWidth={2}
        />
        <Tooltip />
      </Recharts.LineChart>
    </ResponsiveContainer>
  );
}

export function SimpleAreaChart(props: Props) {
  const { height, data, color, xKey, yKey, domain } = props;
  const style = getStyle(color);
  return (
    <ResponsiveContainer width="100%" height={height} margin={{ top: 10 }}>
      <Recharts.AreaChart
        data={data}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <XAxis
          type="number"
          dataKey={xKey}
          domain={domain}
          hide
          tickFormatter={(timeStr) => moment(timeStr).format('DD MMM')}
        />
        <YAxis dataKey={yKey} hide />
        <Area
          name="Value"
          type="monotone"
          dataKey={yKey || 'uv'}
          stroke={style.stroke}
          fill={style.fill}
        />
        <Tooltip />
      </Recharts.AreaChart>
    </ResponsiveContainer>
  );
}
