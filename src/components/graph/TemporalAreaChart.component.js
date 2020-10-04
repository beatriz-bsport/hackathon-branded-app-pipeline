// @flow
import React from 'react';
import moment from 'moment-timezone';
import {
  AreaChart,
  Area,
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
  linearGradient?: boolean,
  stacked?: boolean,
  tooltip?: boolean,
  margin?: { top: number, right: number, bottom: number, left: number },
  noGrid?: boolean,
  xLabel?: string,
  yLabel?: string,
  allowDecimals?: boolean,
  refreshKey: string,
};

export function TemporalAreaChart(props: Props) {
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
  } = props;
  const start = moment(data[0].d);
  const end = moment(data[data.length - 1].d);
  const xFormatter = dateFormatter([start, end]);
  return (
    <ResponsiveContainer width={width || '100%'} height={height || 400}>
      <AreaChart
        data={data}
        margin={margin || { top: 40, right: 20, bottom: 20, left: 30 }}
      >
        <defs>
          {chartOptions.map((areaData) => {
            return (
              props.linearGradient && (
                <linearGradient
                  id={`color-${areaData.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={areaData.fill}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor={areaData.fill}
                    stopOpacity={0}
                  />
                </linearGradient>
              )
            );
          })}
        </defs>
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
        {chartOptions.map((areaData) => {
          return (
            <Area
              key={areaData.dataKey}
              stackId={props.stacked && '1'}
              type="monotone"
              dataKey={areaData.dataKey}
              stroke={areaData.stroke}
              fill={
                props.linearGradient
                  ? `url(#color-${areaData.dataKey})`
                  : areaData.fill
              }
              name={props.tooltip && areaData.caption}
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default TemporalAreaChart;
