// @flow
import React from 'react';
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

import { getPalette, getAnalogColors } from './color-utils';

type Props = {
  height?: number | string,
  width?: number | string,
  legendWidth?: number,
  data: Array<any>,
  baseColor: string,
  chartOptions: Array<{ dataKey: string, caption: string }>,
  outerRadius?: number | string,
  innerRadius?: number | string,
  tooltip?: boolean,
  legend?: boolean,
  margin?: { top: number, right: number, bottom: number, left: number },
};

export function PieChartV2(props: Props) {
  const {
    width,
    height,
    margin,
    chartOptions,
    innerRadius,
    outerRadius,
    tooltip,
    legendWidth,
    baseColor,
    legend,
  } = props;
  const data = props.data.map((entry) => ({
    name: chartOptions.find((option) => entry.name === option.dataKey).caption,
    value: entry.value,
  }));

  let colors = [];

  if (data.length <= 4) {
    colors = getAnalogColors(baseColor);
  } else {
    colors = getPalette(baseColor);
  }

  return (
    <ResponsiveContainer width={width || '100%'} height={height || 400}>
      <PieChart margin={margin || { top: 0, right: 0, bottom: 0, left: 50 }}>
        <Pie
          data={data}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell fill={colors[index % colors.length]} />
          ))}
        </Pie>
        {tooltip ? <Tooltip /> : null}
        {legend ? (
          <Legend
            layout="vertical"
            align="left"
            verticalAlign="middle"
            iconType="circle"
            iconSize={18}
            wrapperStyle={{ overflowWrap: 'break-word' }}
            width={legendWidth || 200}
          />
        ) : null}
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartV2;
