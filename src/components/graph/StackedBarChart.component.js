// @flow
import React from 'react';
import moment from 'moment';
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
  if (duration.asDays() > 60) {
    return (d: any) => moment(d).format('MMM YYYY');
  }
  if (duration.asDays() > 15) {
    return (d: any) => moment(d).format('DD MMM');
  }
  if (duration.asDays() > 1) {
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
      width="100%"
      height={height}
      minHeight={minHeight}
      minWidth={minWidth}
    >
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        key={refreshKey}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey}
          domain={domain}
          tickFormatter={dateFormatter(domain)}
        >
          <Label value={xLabel} position="insideBottom" />
        </XAxis>
        <YAxis
          allowDecimals={!!yAxisAllowDecimals}
          key={refreshKey}
          label={{ value: yLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Bar type="monotone" dataKey={yKeyA} stackId="a" fill={colorA} />
        <Bar type="monotone" dataKey={yKeyB} stackId="a" fill={colorB} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StackedBarChart;
