// @flow
import React from 'react';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';

type Props = {
  data: Array<{ value: number, count: number, week_day: number, hour: number }>,
  schedule_timerange_begin: string,
  schedule_timerange_end: string,
  height: number,
};

const Cell = (props: {
  max: number,
  data: { value: number, count: number },
}) => {
  const scaleValue = props.data.value / props.data.count / props.max;
  const classes = useStyles(scaleValue);
  return (
    <div className={classes.cell}>
      <p>{parseInt((props.data.value || 0) / (props.data.count || 1), 10)}</p>
    </div>
  );
};

const YLegend = (props: { classes: any, value: number }) => (
  <div className={props.classes.yLegendLabel}>
    <Typography align="center" variant="caption">
      {`${props.value}:00`}
    </Typography>
  </div>
);

export const TimeslotGridChart = (props: Props) => {
  const { schedule_timerange_begin, schedule_timerange_end } = props;
  const hour_start = schedule_timerange_begin
    ? moment(props.schedule_timerange_begin).hour()
    : 6;
  const hour_end = schedule_timerange_end
    ? moment(props.schedule_timerange_end).hour()
    : 23;
  const classes = useStyles(props.height);
  const { t } = useTranslation(['datetime']);
  const allValues = props.data.map(
    ({ value, count }) => (value || 0) / (count || 1),
  );
  const max = Math.max(...allValues);
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div style={{ flex: 1 }} />
        {Array(hour_end - hour_start)
          .fill()
          .map((_, n) => (
            <div key={n} style={{ flex: 1 }}>
              <YLegend classes={classes} value={n + hour_start} />
            </div>
          ))}
      </div>
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <div className={classes.row} key={n}>
          <Typography style={{ flex: 1 }} align="center" variant="caption">
            {t(`time.isoWeekdayNumber.${n}`).slice(0, 2)}
          </Typography>
          {Array(hour_end - hour_start)
            .fill()
            .map((__, m) => {
              const data = props.data.find(
                (d) => d.week_day === n && d.hour === m + hour_start,
              ) || { value: 0, count: 0 };
              return (
                <div key={m} style={{ flex: 1, height: 'inherit' }}>
                  <Cell max={max} data={data} />
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: (height) => height,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    height: (height) => height / 8,
  },
  cell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    color: (scaleValue) => (scaleValue > 0.7 ? 'white' : 'black'),
    backgroundColor: (scaleValue) =>
      chroma.scale('OrRd').classes(10)(scaleValue || 0),
  },
  yLegendLabel: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // transform: 'rotate(-45deg)',
    // textOrientation: 'upright',
  },
}));

export default React.memo(TimeslotGridChart, isEqual);
