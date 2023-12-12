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
import { useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import classNames from 'classnames';
import {
  DAILY_DURATION_DISPLAY_LIMIT,
  WEEKLY_DURATION_DISPLAY_LIMIT,
  MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS,
} from '#libs/statistics/utils';

const DEBOUNCING_LIMIT = 200;

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

type ContentPayload = {
  fill: string,
  dataKey: string,
  name: string,
  color: string,
  value: number,
  payload: {
    d: string,
    Bookings: number,
    Cancellations: number,
    Offers: number,
  },
};

type CustomTooltipProps = {
  active: boolean,
  payload: ContentPayload[],
};

const CustomTooltip: React.FC<CustomTooltipProps> = React.memo(
  ({ active, payload }: CustomTooltipProps) => {
    const { t } = useTranslation('translation');
    const classes = useStyles();

    if (active && payload && payload.length) {
      return (
        <Paper className={classes.paper}>
          <Typography variant="body2">{payload[0].payload.d}</Typography>

          <Typography variant="body2">
            {`${t('bookingStatistics.chartsItemLabel.numberOfSessions')}: ${
              payload[0].payload[`${t('bookingStatistics.keys.offers')}`]
            }`}
          </Typography>

          <Typography className={classes.bookingsLabel} variant="body2">
            <span
              className={classNames(classes.square, classes.confirmedSquare)}
            />
            {`${t(
              'bookingStatistics.chartsItemLabel.numberOfConfirmedBookings',
            )}: ${
              payload[0].payload[`${t('bookingStatistics.keys.created')}`]
            }`}
          </Typography>

          <Typography className={classes.bookingsLabel} variant="body2">
            <span
              className={classNames(classes.square, classes.cancelledSquare)}
            />
            {`${t(
              'bookingStatistics.chartsItemLabel.numberOfCancelledBookings',
            )}: ${
              payload[0].payload[`${t('bookingStatistics.keys.cancelled')}`]
            }`}
          </Typography>
        </Paper>
      );
    }

    return null;
  },
);

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
        throttleDelay={DEBOUNCING_LIMIT}
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
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={yKeyA} fill={colorA} stackId="a" type="monotone" />
        <Bar dataKey={yKeyB} fill={colorB} stackId="a" type="monotone" />
      </BarChart>
    </ResponsiveContainer>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    gap: theme.spacing(0.5),
  },
  bookingsLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  square: { height: theme.spacing(1.875), width: theme.spacing(1.875) },
  confirmedSquare: { backgroundColor: theme.palette.primary.main },
  cancelledSquare: { backgroundColor: '#E05123' },
}));

export default React.memo(StackedBarChart);
