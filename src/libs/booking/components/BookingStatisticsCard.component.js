// @flow
import React from 'react';

import moment from 'moment';
import type { Moment } from 'moment';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { colors as bsportColors } from '@bsport/common/lib/colors';
import { discretizeByAndFillMissing } from '../../../state/stats/utils';
import TwoStackedAreasChart from '../../../components/graph/TwoStackedAreasChart.component';
import StackedBarChart from '../../../components/graph/StackedBarChart.component';

type Props = {
  bookingStatistics: {
    createdBookings: Array<any>,
    cancelledBookings: Array<any>,
    start: Moment,
    end: Moment,
  },
  offerId?: number,
  loading: boolean,
};

export function BookingStatisticsCard(props: Props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { bookingStatistics, loading } = props;

  if (!bookingStatistics || loading) {
    return (
      <Paper className={classes.loaderContainer}>
        <CircularProgress />
      </Paper>
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

  const data = [];
  let allBookingsCount = 0;
  let cancelledBookingsCount = 0;

  if (props.offerId) {
    for (
      let i = 0;
      i < tableBookingCreated.length && i < tableBookingCancelled.length;
      i += 1
    ) {
      allBookingsCount += tableBookingCreated[i].v;
      cancelledBookingsCount += tableBookingCancelled[i].v;
      data.push({
        d: tableBookingCreated[i].d,
        [t('bookingStatistics.keys.created')]:
          allBookingsCount - cancelledBookingsCount,
        [t('bookingStatistics.keys.cancelled')]: cancelledBookingsCount,
      });
    }
  } else {
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
      });
    }
    allBookingsCount = tableBookingCreated.reduce(
      (acc, dataPoint) => acc + dataPoint.v,
      0,
    );
    cancelledBookingsCount = tableBookingCancelled.reduce(
      (acc, dataPoint) => acc + dataPoint.v,
      0,
    );
  }

  // xFormatter défini dans TwoStacked OK
  // dans discretiezed... gérer le groupBy différent selon intervale OK
  // Gérer les stacks dans la data, faire une boucle for ici balek
  // chart by week
  return (
    <Paper>
      <Typography variant="h5" className={classes.title}>
        {props.offerId
          ? t('bookingStatistics.offerFilteredBookingRecap')
          : t('bookingStatistics.weekOverview')}
      </Typography>
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
          <Typography color="error" align="center">
            {t('bookingStatistics.cancelledBookings', {
              nb: cancelledBookingsCount,
              count: cancelledBookingsCount,
            })}
          </Typography>
        </div>
      </div>
      {props.offerId ? (
        <div className={classes.chart}>
          <TwoStackedAreasChart
            data={data}
            height={300}
            width={600}
            domain={[start, end]}
            refreshKey={`${start}:${end}`}
            xKey="d"
            yKeyA={t('bookingStatistics.keys.created')}
            yKeyB={t('bookingStatistics.keys.cancelled')}
            colorA={bsportColors.primary}
            colorB="#E05123"
          />
        </div>
      ) : (
        <div className={classes.chart}>
          <StackedBarChart
            data={data}
            height={300}
            width={600}
            domain={[start, end]}
            refreshKey={`${start}:${end}`}
            xKey="d"
            yKeyA={t('bookingStatistics.keys.created')}
            yKeyB={t('bookingStatistics.keys.cancelled')}
            colorA={bsportColors.primary}
            colorB="#E05123"
          />
        </div>
      )}
    </Paper>
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
    padding: theme.spacing(10),
    textAlign: 'center',
  },
  greenText: {
    color: bsportColors.primary,
  },
  chart: {
    marginBottom: theme.spacing(2),
  },
}));

export default BookingStatisticsCard;
