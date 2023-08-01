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
  Label,
} from 'recharts';
import isEqual from 'lodash/isEqual';
import {
  dateFormatter,
  numberFormatter,
  tooltipLabelFormatter,
} from '#libs/statistics/utils';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import TemporalCustomYLabel from './TemporalCustomYLabel.component';

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
  refreshKey?: string,
  isCurrencyFormat?: boolean,
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
    isCurrencyFormat,
  } = props;
  const start = moment(data[0].d);
  const end = moment(data[data.length - 1].d);
  const xFormatter = dateFormatter([start, end]);

  const yLabelFormatted = `${yLabel}${
    isCurrencyFormat ? ` (${getCurrencyDisplay()})` : ''
  }`;

  return (
    <ResponsiveContainer height={height || 400} width={width || '100%'}>
      <AreaChart
        data={data}
        margin={margin || { top: 5, right: 20, bottom: 20, left: 30 }}
      >
        <defs>
          {chartOptions.map((areaData) => {
            return (
              props.linearGradient && (
                <linearGradient
                  id={`color-${areaData.dataKey}`}
                  x1="0"
                  x2="0"
                  y1="0"
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
          interval="preserveStart"
          label={{ value: xLabel, position: 'bottom' }}
          minTickGap={10}
          tickFormatter={xFormatter}
        />
        <YAxis
          key={refreshKey}
          allowDecimals={!!allowDecimals}
          tickFormatter={numberFormatter(false)}
        >
          <Label
            content={
              <TemporalCustomYLabel
                chartHeight={height || 400}
                yLabel={yLabelFormatted}
              />
            }
          />
        </YAxis>
        {props.tooltip && (
          <Tooltip
            formatter={numberFormatter(isCurrencyFormat)}
            labelFormatter={tooltipLabelFormatter([start, end])}
          />
        )}
        {chartOptions.map((areaData) => {
          return (
            <Area
              key={areaData.dataKey}
              dataKey={areaData.dataKey}
              fill={
                props.linearGradient
                  ? `url(#color-${areaData.dataKey})`
                  : areaData.fill
              }
              name={props.tooltip && areaData.caption}
              stackId={props.stacked && '1'}
              stroke={areaData.stroke}
              type="monotone"
            />
          );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default React.memo(TemporalAreaChart, isEqual);
