// @flow
import React from 'react';
import moment from 'moment-timezone';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { dateFormatter } from '../../state/stats/utils';

type Props = {
  height?: number | string,
  width?: number | string,
  data: Array<any>,
  chartOptions: Array<{
    dataKey: string,
    caption?: string,
    stroke: string,
    fill: string,
  }>,
  stacked?: boolean,
  tooltip?: boolean,
  margin?: { top: number, right: number, bottom: number, left: number },
  noGrid?: boolean,
  xLabel?: string,
  yLabel?: string,
  barSize?: number,
  allowDecimals?: boolean,
  refreshKey: string,
};

export function TemporalBarChart(props: Props) {
  const {
    data,
    height,
    width,
    refreshKey,
    xLabel,
    yLabel,
    allowDecimals,
    margin,
    chartOptions,
    noGrid,
    barSize,
  } = props;

  const start = moment(data[0].d);
  const end = moment(data[data.length - 1].d);
  const xFormatter = dateFormatter([start, end]);
  return (
    <ResponsiveContainer width={width || '100%'} height={height || 400}>
      <BarChart
        data={data}
        margin={margin || { top: 40, right: 20, bottom: 20, left: 30 }}
      >
        {noGrid ? null : <CartesianGrid strokeDasharray="3 3" />}
        <XAxis
          dataKey="d"
          tickFormatter={xFormatter}
          label={{ value: xLabel, position: 'bottom' }}
          interval="preserveStart"
          minTickGap={10}
        />
        <YAxis
          allowDecimals={!!allowDecimals}
          key={refreshKey}
          label={{
            value: yLabel,
            angle: -90,
            position: 'insideLeft',
            offset: -5,
          }}
        />
        {props.tooltip && <Tooltip />}
        {chartOptions.map((barData) => {
          return (
            <Bar
              key={barData.dataKey}
              stackId={props.stacked && '1'}
              dataKey={barData.dataKey}
              stroke={barData.stroke}
              fill={barData.fill}
              barSize={barSize}
              name={props.tooltip && barData.caption}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TemporalBarChart;
