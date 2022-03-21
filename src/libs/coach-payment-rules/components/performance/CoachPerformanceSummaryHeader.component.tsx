// @flow

import React from 'react';

import Grid from '@material-ui/core/Grid';

import { useTranslation } from 'react-i18next';
import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import makeStyles from '@material-ui/styles/makeStyles';
import Figure from '../../../../components/graph/Figure.component';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import type { CoachPerformance } from '../../types';
import { formatMinutes } from '../../../../utils/datetime';

type Props = {
  performances: Object<Array<CoachPerformance>>;
  isCoach: boolean;
};

export function CoachPerformanceSummary(props: Props) {
  const { performances } = props;
  const { t } = useTranslation('coach');
  const classes = useStyles();
  // Bookings
  const nbSessions = performances[COACH_PERFORMANCE_FOR_SESSION]
    ? performances[COACH_PERFORMANCE_FOR_SESSION].length
    : null;

  const nbBookings = performances[COACH_PERFORMANCE_FOR_SESSION]
    ? performances[COACH_PERFORMANCE_FOR_SESSION].reduce(
        (a, b) => a + (b.confirmed_bookings || 0),
        0,
      )
    : null;

  const durationTotalBookings = performances[COACH_PERFORMANCE_FOR_SESSION]
    ? performances[COACH_PERFORMANCE_FOR_SESSION].reduce(
        (a, b) => a + (b.duration_minute || 0),
        0,
      )
    : null;

  const totalOnBookings = performances[COACH_PERFORMANCE_FOR_SESSION]
    ? performances[COACH_PERFORMANCE_FOR_SESSION].reduce(
        (a, b) => a + (parseFloat(b.coach_total_payment) || 0),
        0,
      )
    : null;
  const totalMarginValuesOnBookings = performances[
    COACH_PERFORMANCE_FOR_SESSION
  ]
    ? performances[COACH_PERFORMANCE_FOR_SESSION].reduce(
        (a, b) => a + (parseFloat(b.total_margin_value) || 0),
        0,
      )
    : null;
  // Private Bookings

  const nbPrivateServices = performances[COACH_PERFORMANCE_FOR_APPOINTMENT]
    ? performances[COACH_PERFORMANCE_FOR_APPOINTMENT].length
    : null;

  const nbPrivateServiceAttendants = performances[
    COACH_PERFORMANCE_FOR_APPOINTMENT
  ]
    ? performances[COACH_PERFORMANCE_FOR_APPOINTMENT].reduce(
        (a, b) => a + (b.confirmed_bookings || 0),
        0,
      )
    : null;

  const durationTotalPrivateService = performances[
    COACH_PERFORMANCE_FOR_APPOINTMENT
  ]
    ? performances[COACH_PERFORMANCE_FOR_APPOINTMENT].reduce(
        (a, b) => a + (b.duration_minute || 0),
        0,
      )
    : null;

  const totalOnPrivateServices = performances[COACH_PERFORMANCE_FOR_APPOINTMENT]
    ? performances[COACH_PERFORMANCE_FOR_APPOINTMENT].reduce(
        (a, b) => a + (parseFloat(b.coach_total_payment) || 0),
        0,
      )
    : null;
  const totalMarginValuePrivateBookings = performances[
    COACH_PERFORMANCE_FOR_APPOINTMENT
  ]
    ? performances[COACH_PERFORMANCE_FOR_APPOINTMENT].reduce(
        (a, b) => a + (parseFloat(b.total_margin_value) || 0),
        0,
      )
    : null;

  // Overall
  const totalDuration =
    (durationTotalBookings || 0) + (durationTotalPrivateService || 0);

  const totalNetGain =
    (totalMarginValuesOnBookings || 0) -
    (totalOnBookings || 0) +
    (totalMarginValuePrivateBookings || 0) -
    (totalOnPrivateServices || 0);
  return (
    <Grid container direction="row" spacing={2} className={classes.root}>
      <Grid item xs={12} md={props.isCoach ? 4 : 3} id="nbOffersTotal">
        <Figure
          name={t('performance.nbOffersTotal')}
          count={nbSessions + nbPrivateServices || '-'}
          color="red"
        />
      </Grid>
      {props.isCoach ? (
        <Grid item xs={12} md={props.isCoach ? 4 : 3} id="durationBookings">
          <Figure
            name={t('performance.durationBookings')}
            count={totalDuration ? `${formatMinutes(totalDuration, t)}` : '-'}
            color="marine"
          />
        </Grid>
      ) : (
        <Grid item xs={12} md={props.isCoach ? 4 : 3} id="nbBookings">
          <Figure
            name={t('performance.nbBookings')}
            count={(nbBookings || 0) + (nbPrivateServiceAttendants || 0) || '-'}
            color="marine"
          />
        </Grid>
      )}
      <Grid item xs={12} md={props.isCoach ? 4 : 3}>
        <Figure
          name={t('performance.payment')}
          count={
            totalOnBookings || totalOnPrivateServices
              ? `${getCurrencyDisplayWithPrice(
                  (
                    (totalOnBookings || 0) + (totalOnPrivateServices || 0)
                  ).toFixed(2),
                )}`
              : '-'
          }
          color="green"
        />
      </Grid>
      {!props.isCoach && (
        <Grid item xs={12} md={props.isCoach ? 4 : 3}>
          <Figure
            name={t('performance.totalNetGain')}
            count={
              totalNetGain && totalNetGain !== 0
                ? `${getCurrencyDisplayWithPrice(totalNetGain.toFixed(2))}`
                : '-'
            }
            color="green"
          />
        </Grid>
      )}
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1) * 1,
    paddingBottom: theme.spacing(2),
  },
}));

export default CoachPerformanceSummary;
