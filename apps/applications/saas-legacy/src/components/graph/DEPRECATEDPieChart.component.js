// @flow

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const colors = [
  { fill: 'rgba(76, 92, 104, 1) ' },
  { fill: 'rgba(197, 195, 198, 1) ' },
  { fill: '#847577' },
  { fill: 'rgba(70, 73, 76, 1) ' },
  { fill: 'rgba(25, 133, 161, 1) ' },
  { fill: 'rgba(220, 220, 221, 1)' },
];

type PropsBase = {
  data: any,
  height: number,
};

export function PieChartBase(props: PropsBase) {
  return (
    <ResponsiveContainer height={props.height} width="100%">
      <PieChart>
        <Pie
          data={props.data}
          dataKey="value"
          endAngle={-180}
          isAnimationActive={false}
          labelLine={false}
          startAngle={180}
        >
          {props.data.map((entry, index) => (
            <Cell key={`slice-${index}`} fill={colors[index % 6].fill} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          align="left"
          height={36}
          iconType="circle"
          layout="vertical"
          verticalAlign="center"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

type Props = {
  data: any,
  title: string,
  width: number,
  height: number,
  classes: Object,
  loading: boolean,
};

export function PieChartComposed(props: Props) {
  return (
    <div className={props.classes.container} style={{ width: '100%' }}>
      {props.loading && props.data.length === 0 ? (
        <div
          style={{
            width: '100%',
            height: props.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <PieChartBase
          data={props.data}
          height={props.height}
          width={props.width}
        />
      )}
      <div className={props.classes.title}>
        <Typography variant="subtitle2">{props.title}</Typography>
      </div>
    </div>
  );
}

const styles = () => ({
  container: { width: '100%' },
  title: {
    display: 'flex',
    justifyContent: 'center',
  },
});

export default compose(withStyles(styles))(PieChartComposed);
