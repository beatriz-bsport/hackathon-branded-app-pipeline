// @flow

import React from 'react';

import moment from 'moment';
import { compose } from 'recompose';

import { withTranslation } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ComposedChart } from '../../../components/graph/Charts.component';

type Props = {
  classes: Object,
  data: any,
  xFormatter: string,
  title: string,
  yLabel: string,
  height: number,
  loading: boolean,
  colorId: number,
};
const color2 = [
  { fill: 'rgba(197, 195, 198, 1) ' },
  { fill: 'rgba(70, 73, 76, 1) ' },
  { fill: 'rgba(220, 220, 221, 1)' },
  { fill: 'rgba(76, 92, 104, 1) ' },
  { fill: 'rgba(25, 133, 161, 1) ' },
];

function dateFormatter(kind) {
  if (kind === 'month') {
    return (d) => moment(d).format('MMM YYYY');
  }
  if (kind === 'week') {
    return (d) => `Semaine du ${moment(d).format('DD MMM YYYY')}`;
  }
  return (d) => moment(d).format('ddd DD MMM');
}

export const TemporalStatistic = React.memo((props: Props) => {
  return (
    <div className={props.classes.block}>
      {props.loading ? (
        <div
          style={{
            height: props.height,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <ComposedChart
          data={props.data}
          height={props.height}
          xKey="d"
          continuous
          color={color2[props.colorId].fill}
          yKey="v"
          yLabel={props.yLabel}
          xFormatter={dateFormatter(props.xFormatter)}
          yFormatter={(v) => Math.ceil(v)}
        />
      )}
      <div className={props.classes.title}>
        <Typography variant="subtitle2">{props.title}</Typography>
      </div>
    </div>
  );
});

const styles = (theme) => ({
  block: {
    marginTop: theme.spacing(2),
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default compose(
  withStyles(styles),
  withTranslation('dashboard'),
)(TemporalStatistic);
