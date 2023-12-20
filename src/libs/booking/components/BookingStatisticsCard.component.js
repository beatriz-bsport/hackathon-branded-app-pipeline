import React from 'react';

import moment, { Moment } from 'moment-timezone';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useMediaQuery } from '@material-ui/core';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

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
      [t('bookingStatistics.keys.offers')]: tableOffers?.[i]?.v || 0,
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
          <div className={classes.nbOffersContainer}>
            <Typography align="center" variant="body1">
              <Trans
                components={[<br />]}
                count={allOffersCount}
                i18nKey="bookingStatistics.totalOffers"
                values={{ nb_offers: allOffersCount }}
              />
            </Typography>
          </div>
          <div className={classes.bookingsStats}>
            <div className={classes.totalBookingStatsContainer}>
              <Typography align="center" variant="body1">
                <Trans
                  components={isMobile ? [<br />] : []}
                  count={allBookingsCount}
                  i18nKey="bookingStatistics.bookingsTotalCount"
                  values={{ nb: allBookingsCount }}
                />
              </Typography>
            </div>
            <div className={classes.bookingsConfirmationStatsWrapper}>
              <div className={classes.bookingsConfirmationStatsContainer}>
                <Typography
                  align="center"
                  className={classes.bookingsLabel}
                  variant="body1"
                >
                  <span
                    className={classNames(
                      classes.square,
                      classes.confirmedSquare,
                    )}
                  />
                  {t('bookingStatistics.confirmedBookings', {
                    nb: allBookingsCount - cancelledBookingsCount,
                  })}
                </Typography>
                <Typography
                  align="center"
                  className={classes.bookingsLabel}
                  variant="body1"
                >
                  <span
                    className={classNames(
                      classes.square,
                      classes.cancelledSquare,
                    )}
                  />
                  {t('bookingStatistics.bookingsCancelled', {
                    nb: cancelledBookingsCount,
                  })}
                </Typography>
              </div>
            </div>
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
  bookingsConfirmationStatsWrapper: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
  },
  bookingsConfirmationStatsContainer: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(5),
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      padding: theme.spacing(2, 2),
      alignItems: 'flex-start',
    },
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  bookingsStats: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: { flexDirection: 'column' },
    [theme.breakpoints.down('xs')]: { flexDirection: 'row' },
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 2,
    alignSelf: 'stretch',
  },
  nbOffersContainer: {
    flex: 1,
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: { borderRight: '1px solid #EEEEEE' },
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      borderBottom: '1px solid #EEEEEE',
    },
  },
  rightBorder: {
    borderRight: '1px solid #EEEEEE',
  },
  bottomBorder: { borderBottom: '1px solid #EEEEEE' },
  statContainer: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: { flexDirection: 'row' },
    [theme.breakpoints.down('xs')]: { flexDirection: 'column' },
    alignItems: 'center',
    borderTop: '1px solid #EEEEEE',
    marginBottom: theme.spacing(2),
    borderBottom: '1px solid #EEEEEE',
  },
  totalBookingStatsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    flex: 1,
    [theme.breakpoints.up('sm')]: { borderBottom: '1px solid #EEEEEE' },
    [theme.breakpoints.down('xs')]: { borderRight: '1px solid #EEEEEE' },
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
  bookingsLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  square: { height: theme.spacing(1.875), width: theme.spacing(1.875) },
  confirmedSquare: { backgroundColor: theme.palette.primary.main },
  cancelledSquare: { backgroundColor: '#E05123' },
}));

export default React.memo(BookingStatisticsCard);
