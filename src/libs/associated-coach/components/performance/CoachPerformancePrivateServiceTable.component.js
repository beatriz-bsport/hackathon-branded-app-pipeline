// @flow

import React from 'react';
import moment from 'moment-timezone';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import AttachIcon from '@material-ui/icons/AttachFile';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CoachPaymentRuleSelector from '../../../coach-payment-rules/components/CoachPaymentRuleSelector.component';
import type { CoachPaymentRule } from '../../../coach-payment-rules/types';
import { downloadAsCsv } from '../../../../utils/downloader';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import { formatMinutes } from '../../../../utils/datetime';

type Props = {
  performances: *[],
  t: TFunction,
  coachPaymentRulesList: Array<CoachPaymentRule>,
  updatePrivateBookingCoachPaymentRule: (
    associatedCoachId: number,
    privateBookingId: number,
    CoachPaymenrRuleId: number,
  ) => void,
  coach: Coach,
};

export function CoachPerformancePrivateServiceTable(props: Props) {
  const {
    t,
    coach,
    coachPaymentRulesList,
    updatePrivateBookingCoachPaymentRule,
    performances,
  } = props;
  const classes = useStyles();
  const coach_payment_error =
    performances && performances.find((perf) => perf.error);
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
      <Table>
        <TableHead>
          <TableCell>{t('fields.name')}</TableCell>
          <TableCell>{t('fields.date')}</TableCell>
          <TableCell>{t('fields.duration')}</TableCell>
          <TableCell>{t('fields.confirmed_bookings')}</TableCell>
          <TableCell>{t('fields.cancelled_bookings')}</TableCell>
          <TableCell>{t('fields.base')}</TableCell>
          <TableCell>{t('fields.bonus')}</TableCell>
          <TableCell>{t('fields.total')}</TableCell>
          <TableCell>{t('fields.rule')}</TableCell>
        </TableHead>
        <TableBody>
          {coach_payment_error && (
            <TableRow>
              <TableCell colSpan={9}>
                <Typography color="error">{t('fields.error')}</Typography>
              </TableCell>
            </TableRow>
          )}
          {performances &&
            performances.map((private_service) => (
              <TableRow
                key={private_service.private_booking_id}
                className={private_service.error ? classes.tableRowError : null}
              >
                <TableCell>{private_service.private_service_name}</TableCell>
                <TableCell>
                  {`${moment(private_service.date_start).format('L')} ${moment(
                    private_service.date_start,
                  ).format('LT')}`}
                </TableCell>
                <TableCell>
                  {formatMinutes(private_service.duration_minute, t)}
                </TableCell>
                <TableCell>{private_service.confirmed_bookings}</TableCell>
                <TableCell>{private_service.cancelled_bookings}</TableCell>
                <TableCell>
                  {getCurrencyDisplayWithPrice(
                    private_service.base_remuneration,
                  )}
                </TableCell>
                <TableCell>
                  {getCurrencyDisplayWithPrice(
                    private_service.coach_bonus || 0,
                  )}
                </TableCell>
                <TableCell>
                  {getCurrencyDisplayWithPrice(
                    private_service.coach_total_payment || 0,
                  )}
                </TableCell>
                <TableCell>
                  <CoachPaymentRuleSelector
                    id="payment_rule_per_private_service"
                    coachPaymentRulesList={coachPaymentRulesList}
                    selected={private_service.coach_payment_rule}
                    isOverride
                    enableReset
                    onChange={({ value }) => {
                      updatePrivateBookingCoachPaymentRule({
                        privateBookingId: private_service.private_booking_id,
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

const useStyles = makeStyles(() => ({
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
}));

export default withTranslation(['coachPerformance'])(
  CoachPerformancePrivateServiceTable,
);
