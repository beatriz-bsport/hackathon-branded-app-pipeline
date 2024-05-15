// @flow
import React from 'react';
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
import { DateTime } from 'luxon';
import {
  DAILY_DURATION_DISPLAY_LIMIT,
  WEEKLY_DURATION_DISPLAY_LIMIT,
  MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS,
} from '#libs/statistics/utils';
import { STATISTICS_FORMAT } from '#libs/statistics/constants';

type Props = {
  data: Array<any>,
  height: number,
  width: number,
  domain: Array<any>,
  refreshKey: string,
  xKey: string,
  yKeyA: string,
  colorA: string,
  yKeyB: string,
  colorB: string,

  xLabel?: string,
  yLabel?: string,
  yAxisAllowDecimals?: boolean,
  minHeight?: number,
  minWidth?: number,
};

const dateFormatter = (domain: Array<string>) => {
  const start = DateTime.fromFormat(domain[0], STATISTICS_FORMAT);
  const end = DateTime.fromFormat(domain[1], STATISTICS_FORMAT);
  const durationInDays = end.diff(start, 'days').days;

  if (durationInDays > MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS) {
    return (d: string) =>
      DateTime.fromFormat(d, STATISTICS_FORMAT).toFormat('MMM yyyy');
  }
  if (durationInDays > WEEKLY_DURATION_DISPLAY_LIMIT) {
    return (d: string) =>
      DateTime.fromFormat(d, STATISTICS_FORMAT).toFormat('dd MMM');
  }
  if (durationInDays > DAILY_DURATION_DISPLAY_LIMIT) {
    return (d: string) =>
      DateTime.fromFormat(d, STATISTICS_FORMAT).toFormat('ccc dd MMM');
  }
  return (d: string) => DateTime.fromFormat(d, STATISTICS_FORMAT).toFormat('t');
};

export function TwoStackedAreasChart(props: Props) {
  const {
    data,
    height,
    width,
    domain,
    refreshKey,
    xKey,
    yKeyA,
    colorA,
    yKeyB,
    colorB,
    xLabel,
    yLabel,
    yAxisAllowDecimals,
    minHeight,
    minWidth,
  } = props;
  return (
    <ResponsiveContainer
      height={height}
      minHeight={minHeight}
      minWidth={minWidth}
      width="100%"
    >
      <AreaChart
        key={refreshKey}
        data={data}
        height={height}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        width={width}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey}
          domain={domain}
          tickFormatter={dateFormatter(domain)}
        >
          <Label position="insideBottom" value={xLabel} />
        </XAxis>
        <YAxis
          key={refreshKey}
          allowDecimals={!!yAxisAllowDecimals}
          label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Area
          dataKey={yKeyA}
          fill={colorA}
          stackId="1"
          stroke={colorA}
          type="monotone"
        />
        <Area
          dataKey={yKeyB}
          fill={colorB}
          stackId="1"
          stroke={colorB}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default TwoStackedAreasChart;
