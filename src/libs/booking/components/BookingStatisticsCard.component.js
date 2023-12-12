import React from 'react';

import moment, { Moment } from 'moment-timezone';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { discretizeByAndFillMissing } from '../../../state/stats/utils';
import StackedBarChart from '../../../components/graph/StackedBarChart.component';

type Props = {
  bookingStatistics: {
    createdBookings: Immutable.ImmutableArray<
      Immutable.Immutable<StatisticPoint>,
    >,
    cancelledBookings: Immutable.ImmutableArray<
      Immutable.Immutable<StatisticPoint>,
    >,
    offers: Immutable.ImmutableArray<Immutable.Immutable<StatisticPoint>>,
    start: Moment,
    end: Moment,
  },
  offerId?: number,
  loading: boolean,
  title?: string,
};

export function BookingStatisticsCard(props: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { bookingStatistics, loading } = props;

  if (!bookingStatistics || loading) {
    return (
      <div className={classes.loaderContainer}>
        <CircularProgress />
      </div>
    );
  }

  const start = moment(bookingStatistics.start).format();
  const end = moment(bookingStatistics.end).format();

  const tableBookingCreated = discretizeByAndFillMissing(
    bookingStatistics.createdBookings,
    start,
    end,
  );
  const tableBookingCancelled = discretizeByAndFillMissing(
    bookingStatistics.cancelledBookings,
    start,
    end,
  );

  const tableOffers = discretizeByAndFillMissing(
    bookingStatistics.offers,
    start,
    end,
  );

  const allOffersCount = tableOffers.reduce(
    (acc, dataPoint) => acc + dataPoint.v,
    0,
  );

  const allBookingsCount = tableBookingCreated.reduce(
    (acc, dataPoint) => acc + dataPoint.v,
    0,
  );

  const cancelledBookingsCount = tableBookingCancelled.reduce(
    (acc, dataPoint) => acc + dataPoint.v,
    0,
  );

  const data = [];

  // Here, we build data with every day of the week
  for (
    let i = 0;
    i < tableBookingCreated.length && i < tableBookingCancelled.length;
    i += 1
  ) {
    data.push({
      d: tableBookingCreated[i].d,
      [t('bookingStatistics.keys.created')]:
        tableBookingCreated[i].v - tableBookingCancelled[i].v,
      [t('bookingStatistics.keys.cancelled')]: tableBookingCancelled[i].v,
      [t('bookingStatistics.keys.offers')]: tableOffers[i].v,
    });
  }

  return (
    <div>
      <Typography className={classes.title} variant="h5">
        {props.offerId
          ? t('bookingStatistics.offerFilteredBookingRecap', {
              date: props.title,
            })
          : t('bookingStatistics.weekOverview')}
      </Typography>
      <Paper>
        <div className={classes.statContainer}>
          <div className={classNames(classes.rightBorder, classes.stat)}>
            <div>
              <Typography align="center">
                {t('bookingStatistics.totalBookings', {
                  nb: allBookingsCount,
                  count: allBookingsCount,
                })}
              </Typography>
            </div>
          </div>
          <div className={classes.stat}>
            <Typography align="center" className={classes.greenText}>
              {t('bookingStatistics.maintenedBookings', {
                nb: allBookingsCount - cancelledBookingsCount,
                count: allBookingsCount - cancelledBookingsCount,
              })}
            </Typography>
          </div>
          <div className={classNames(classes.rightBorder, classes.stat)}>
            <Typography align="center" color="error">
              {t('bookingStatistics.cancelledBookings', {
                nb: cancelledBookingsCount,
                count: cancelledBookingsCount,
              })}
            </Typography>
          </div>
        </div>
        <div className={classes.chart}>
          <StackedBarChart
            colorA={theme.palette.primary.main}
            colorB="#E05123"
            data={data}
            domain={[start, end]}
            height={300}
            refreshKey={`${start}:${end}`}
            width={600}
            xKey="d"
            yKeyA={t('bookingStatistics.keys.created')}
            yKeyB={t('bookingStatistics.keys.cancelled')}
          />
        </div>
      </Paper>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  stat: {
    flex: 3,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #EEEEEE',
  },
  rightBorder: {
    borderRight: '1px solid #EEEEEE',
  },
  statContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderTop: '1px solid #EEEEEE',
    marginBottom: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(2),
  },
  loaderContainer: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenText: {
    color: theme.palette.primary.main,
  },
  chart: {
    marginBottom: theme.spacing(2),
  },
}));

export default BookingStatisticsCard;
