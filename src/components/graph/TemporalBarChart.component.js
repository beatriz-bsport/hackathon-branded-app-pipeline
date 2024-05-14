// @flow
import React from 'react';
import { DateTime } from 'luxon';
import {
  BarChart,
  Bar,
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
  stacked?: boolean,
  tooltip?: boolean,
  margin?: { top: number, right: number, bottom: number, left: number },
  noGrid?: boolean,
  xLabel?: string,
  yLabel?: string,
  barSize?: number,
  allowDecimals?: boolean,
  refreshKey?: string,
  isCurrencyFormat?: boolean,
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
    isCurrencyFormat,
  } = props;
  const start = DateTime.fromISO(data[0].d);
  const end = DateTime.fromISO(data[data.length - 1].d);
  const xFormatter = dateFormatter([start, end]);

  const yLabelFormatted = `${yLabel}${
    isCurrencyFormat ? ` (${getCurrencyDisplay()})` : ''
  }`;

  return (
    <ResponsiveContainer height={height || 400} width={width || '100%'}>
      <BarChart
        data={data}
        margin={margin || { top: 5, right: 20, bottom: 20, left: 30 }}
      >
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
        {chartOptions.map((barData) => {
          return (
            <Bar
              key={barData.dataKey}
              barSize={barSize}
              dataKey={barData.dataKey}
              fill={barData.fill}
              name={props.tooltip && barData.caption}
              stackId={props.stacked && '1'}
              stroke={barData.stroke}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default React.memo(TemporalBarChart, isEqual);
