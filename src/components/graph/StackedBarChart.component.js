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
  Label,
} from 'recharts';
import {
  DAILY_DURATION_DISPLAY_LIMIT,
  WEEKLY_DURATION_DISPLAY_LIMIT,
  MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS,
} from '#libs/statistics/utils';

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

const dateFormatter = (domain: Array<Moment>) => {
  const duration = moment.duration(moment(domain[1]).diff(moment(domain[0])));
  if (duration.asDays() > MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS) {
    return (d: any) => moment(d).format('MMM YYYY');
  }
  if (duration.asDays() > WEEKLY_DURATION_DISPLAY_LIMIT) {
    return (d: any) => moment(d).format('DD MMM');
  }
  if (duration.asDays() > DAILY_DURATION_DISPLAY_LIMIT) {
    return (d: any) => moment(d).format('ddd DD MMM');
  }
  return (d: any) => moment(d).format('LT');
};

export function StackedBarChart(props: Props) {
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
      <BarChart
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
        <Bar dataKey={yKeyA} fill={colorA} stackId="a" type="monotone" />
        <Bar dataKey={yKeyB} fill={colorB} stackId="a" type="monotone" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StackedBarChart;
