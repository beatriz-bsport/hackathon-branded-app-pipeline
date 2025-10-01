// @flow
import React from 'react';
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

import clsx from 'clsx';
import {
  parseRechartsDate,
  DAILY_DURATION_DISPLAY_LIMIT,
  WEEKLY_DURATION_DISPLAY_LIMIT,
  MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS,
} from '#src/libs/statistics/utils';

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
  colorC: string,
  yKeyC: string,
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
    WaitingLists: number,
  },
};

type CustomTooltipProps = {
  active: boolean,
  payload: ContentPayload[],
};

const getToolTipRowLabel = (
  payload: ContentPayload[],
  type: 'sessions' | 'confirmedBookings' | 'cancelledBookings' | 'waitingList',
  t: TFunction,
) => {
  let labelMessage: string = '';
  let keyMessage: string = '';

  switch (type) {
    case 'sessions':
      labelMessage = t('bookingStatistics.chartsItemLabel.numberOfSessions');
      keyMessage = t('bookingStatistics.keys.offers');
      break;

    case 'confirmedBookings':
      labelMessage = t(
        'bookingStatistics.chartsItemLabel.numberOfConfirmedBookings',
      );
      keyMessage = t('bookingStatistics.keys.created');
      break;

    case 'cancelledBookings':
      labelMessage = t(
        'bookingStatistics.chartsItemLabel.numberOfCancelledBookings',
      );
      keyMessage = t('bookingStatistics.keys.cancelled');
      break;

    case 'waitingList':
      labelMessage = t('bookingStatistics.chartsItemLabel.waitingListSize');
      keyMessage = t('bookingStatistics.keys.waitingLists');
      break;

    default:
      break;
  }

  const value = payload[0].payload[keyMessage];

  return `${labelMessage}: ${value}`;
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
            {getToolTipRowLabel(payload, 'sessions', t)}
          </Typography>

          <Typography className={classes.bookingsLabel} variant="body2">
            <span className={clsx(classes.square, classes.confirmedSquare)} />
            {getToolTipRowLabel(payload, 'confirmedBookings', t)}
          </Typography>

          <Typography className={classes.bookingsLabel} variant="body2">
            <span className={clsx(classes.square, classes.cancelledSquare)} />
            {getToolTipRowLabel(payload, 'cancelledBookings', t)}
          </Typography>

          <Typography className={classes.bookingsLabel} variant="body2">
            <span className={clsx(classes.square, classes.waitingListSquare)} />
            {getToolTipRowLabel(payload, 'waitingList', t)}
          </Typography>
        </Paper>
      );
    }

    return null;
  },
);

const dateFormatter = (domain: [string, string]) => (d: string) => {
  const start = parseRechartsDate(domain[0]);
  const end = parseRechartsDate(domain[1]);
  const durationInDays = Math.floor(end.diff(start, 'days').as('days'));

  const date = parseRechartsDate(d);

  if (durationInDays > MONTHLY_DURATION_DISPLAY_LIMIT_60_DAYS) {
    return date.toFormat('MMM yyyy');
  }
  if (durationInDays > WEEKLY_DURATION_DISPLAY_LIMIT) {
    return date.toFormat('dd MMM');
  }
  if (durationInDays > DAILY_DURATION_DISPLAY_LIMIT) {
    return date.toFormat('ccc dd MMM');
  }
  return date.toFormat('t');
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
    colorC,
    yKeyC,
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
        <Bar dataKey={yKeyC} fill={colorC} stackId="a" type="monotone" />
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
  confirmedSquare: { backgroundColor: theme.palette.success.main },
  cancelledSquare: { backgroundColor: theme.palette.error.dark },
  waitingListSquare: { backgroundColor: theme.palette.warning.main },
}));

export default React.memo(StackedBarChart);
