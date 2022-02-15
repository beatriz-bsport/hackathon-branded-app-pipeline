// @flow

import React from 'react';
import moment from 'moment-timezone';
import amber from '@material-ui/core/colors/amber';
import { useTranslation } from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import AttachIcon from '@material-ui/icons/AttachFile';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import clx from 'classnames';
import CoachPaymentRuleSelector from '../coach-payment-rule-selector/CoachPaymentRuleSelector.component';
import type { CoachPaymentRule, CoachPerformance } from '../../types';
import { downloadAsCsv } from '../../../../utils/downloader';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import { formatMinutes } from '../../../../utils/datetime';
import type { Coach } from '#libs/associated-coach/types';

type Props = {
  performances: Array<CoachPerformance>;
  coachPaymentRulesList: Array<CoachPaymentRule>;
  updatePrivateBookingCoachPaymentRule: (params: {
    associatedCoachId: number;
    privateBookingId: number;
    coachPaymentRuleId: number;
  }) => void;
  coach: Coach;
};

export function CoachPerformancePrivateServiceTable(props: Props) {
  const {
    coach,
    coachPaymentRulesList,
    updatePrivateBookingCoachPaymentRule,
    performances,
  } = props;
  const { t } = useTranslation('coachPerformance');
  const classes = useStyles();
  const coach_payment_error =
    performances && performances.find((perf) => perf.error && !perf.is_unpaid);
  const unpaid_private_booking_exists =
    performances && performances.find((perf) => perf.is_unpaid);
  return (
    <div>
      <div className={classes.flexHeaderContainer}>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: 12 }}
          disabled={!performances}
          onClick={() =>
            downloadAsCsv(
              [
                t('fields.name'),
                t('fields.date'),
                t('fields.duration'),
                t('fields.confirmed_bookings'),
                t('fields.cancelled_bookings'),
                t('fields.base'),
                t('fields.bonus'),
                t('fields.total'),
                t('fields.rule'),
              ],
              performances.map((session) => [
                session.private_service_name,
                `${moment(session.date_start).format('L')} ${moment(
                  session.date_start,
                ).format('LT')}`,
                session.duration_minute,
                session.confirmed_bookings,
                session.cancelled_bookings,
                session.base_remuneration,
                session.coach_bonus,
                session.coach_total_payment,
                (
                  coachPaymentRulesList.find(
                    (cpr) => cpr.id === session.coach_payment_rule,
                  ) || { name: 'default' }
                ).name,
              ]),
              'payroll.csv',
            )
          }
        >
          <AttachIcon style={{ marginRight: 12 }} />
          {t('table.download')}
        </Button>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">{t('fields.name')}</TableCell>
            <TableCell align="right">{t('fields.date')}</TableCell>
            <TableCell align="right">{t('fields.duration')}</TableCell>
            <TableCell align="right">
              {t('fields.confirmed_bookings')}
            </TableCell>
            <TableCell align="right">
              {t('fields.cancelled_bookings')}
            </TableCell>
            <TableCell align="right">{t('fields.base')}</TableCell>
            <TableCell align="right">{t('fields.bonus')}</TableCell>
            <TableCell align="right"> {t('fields.total')}</TableCell>
            <TableCell align="right">{t('fields.rule')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(coach_payment_error || unpaid_private_booking_exists) && (
            <TableRow>
              <TableCell colSpan={9}>
                {!!coach_payment_error && (
                  <Typography
                    color="error"
                    className={classes.tableRowErrorHelper}
                  >
                    {t('fields.error')}
                  </Typography>
                )}
                {!!unpaid_private_booking_exists && (
                  <Typography
                    color="error"
                    className={classes.tableRowUnpaidHelper}
                  >
                    {t('fields.unpaid_private_booking')}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          )}
          {performances &&
            performances.map((private_service_perf) => (
              <TableRow
                key={private_service_perf.private_booking_id}
                className={clx({
                  [classes.tableRowError]:
                    private_service_perf.error &&
                    !private_service_perf.is_unpaid,
                  [classes.tableRowErrorUnpaid]: private_service_perf.is_unpaid,
                })}
              >
                <TableCell align="left">
                  {private_service_perf.private_service_name}
                </TableCell>
                <TableCell align="right">
                  {`${moment(private_service_perf.date_start).format(
                    'L',
                  )} ${moment(private_service_perf.date_start).format('LT')}`}
                </TableCell>
                <TableCell align="right">
                  {formatMinutes(private_service_perf.duration_minute, t)}
                </TableCell>
                <TableCell align="right">
                  {private_service_perf.confirmed_bookings}
                </TableCell>
                <TableCell align="right">
                  {private_service_perf.cancelled_bookings}
                </TableCell>
                <TableCell align="right">
                  {getCurrencyDisplayWithPrice(
                    private_service_perf.base_remuneration,
                  )}
                </TableCell>
                <TableCell align="right">
                  {getCurrencyDisplayWithPrice(
                    private_service_perf.coach_bonus || 0,
                  )}
                </TableCell>
                <TableCell align="right">
                  {getCurrencyDisplayWithPrice(
                    private_service_perf.coach_total_payment || 0,
                  )}
                </TableCell>
                <TableCell>
                  <CoachPaymentRuleSelector
                    id="payment_rule_per_private_service"
                    coachPaymentRulesList={coachPaymentRulesList}
                    selected={private_service_perf.coach_payment_rule}
                    isOverride
                    enableReset
                    onChange={({ value }: { value: number }) => {
                      updatePrivateBookingCoachPaymentRule({
                        privateBookingId:
                          private_service_perf.private_booking_id,
                        coachPaymentRuleId: value,
                        associatedCoachId: coach.associated_coach_id,
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  flexHeaderContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
  },
  tableRowError: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
  tableRowErrorUnpaid: {
    backgroundColor: amber[100],
    '&:hover': {
      backgroundColor: amber[200],
    },
  },
  tableRowErrorHelper: {
    '&::before': {
      content: '"\u2022"',
      paddingRight: theme.spacing(1),
    },
  },
  tableRowUnpaidHelper: {
    color: amber[900],
    '&::before': {
      content: '"\u2022"',
      paddingRight: theme.spacing(1),
    },
  },
}));

export default CoachPerformancePrivateServiceTable;
