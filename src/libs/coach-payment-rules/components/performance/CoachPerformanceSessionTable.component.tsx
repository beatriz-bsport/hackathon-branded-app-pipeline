// @flow

import React from 'react';
import moment from 'moment-timezone';

import { useTranslation } from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import AttachIcon from '@material-ui/icons/AttachFile';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
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
  setSessionCoachPaymentRule: (params: {
    associatedCoachId: number;
    sessionId: number;
    coachPaymentRuleId: number;
  }) => void;
  coach: Coach;
  hideRuleSetter?: boolean;
  asCoach?: boolean;
  displayChip?: boolean;
};

export function CoachPerformanceSessionTable(props: Props) {
  const {
    coach,
    coachPaymentRulesList,
    setSessionCoachPaymentRule,
    performances,
  } = props;
  const { t } = useTranslation('coachPerformance');
  const classes = useStyles();
  const coach_payment_error =
    performances && performances.find((perf) => perf.error);

  return (
    <div>
      <div
        className={clx([
          classes.flexHeaderContainer,
          props.asCoach && props.displayChip
            ? classes.flexStartContainer
            : null,
        ])}
      >
        {props.displayChip && (
          <Chip
            variant="outlined"
            color="primary"
            style={{ marginTop: 15, marginLeft: 10 }}
            label={
              <Typography variant="subtitle2">
                {t('paymentRules:tabs.session')}
              </Typography>
            }
          />
        )}
        {!props.asCoach && (
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
                  session.session_name,
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
        )}
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">{t('fields.name')}</TableCell>
            <TableCell align="right">{t('fields.date')}</TableCell>
            <TableCell align="right">{t('fields.duration')}</TableCell>
            {!props.asCoach && (
              <>
                <TableCell align="right">
                  {t('fields.confirmed_bookings')}
                </TableCell>
                <TableCell align="right">
                  {t('fields.cancelled_bookings')}
                </TableCell>
                <TableCell align="right">{t('fields.base')}</TableCell>
                <TableCell align="right">{t('fields.bonus')}</TableCell>
              </>
            )}
            <TableCell align="right">{t('fields.total')}</TableCell>
            {!props.asCoach && (
              <>
                <TableCell align="right">{t('fields.marginValue')}</TableCell>
                <TableCell align="right">{t('fields.netGain')}</TableCell>
              </>
            )}
            {!props.hideRuleSetter && (
              <TableCell align="right">{t('fields.rule')}</TableCell>
            )}
          </TableRow>
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
            performances.map((session) => (
              <TableRow
                key={session.session_id}
                className={session.error ? classes.tableRowError : null}
              >
                <TableCell align="left">{session.session_name}</TableCell>
                <TableCell align="right">
                  {`${moment(session.date_start).format('L')} ${moment(
                    session.date_start,
                  ).format('LT')}`}
                </TableCell>
                <TableCell align="right">
                  {formatMinutes(session.duration_minute, t)}
                </TableCell>
                {!props.asCoach && (
                  <>
                    <TableCell align="right">
                      {session.confirmed_bookings}
                    </TableCell>
                    <TableCell align="right">
                      {session.cancelled_bookings}
                    </TableCell>
                    <TableCell align="right">
                      {getCurrencyDisplayWithPrice(session.base_remuneration)}
                    </TableCell>
                    <TableCell align="right">
                      {getCurrencyDisplayWithPrice(session.coach_bonus || 0)}
                    </TableCell>
                  </>
                )}

                <TableCell align="right">
                  {getCurrencyDisplayWithPrice(
                    session.coach_total_payment || 0,
                  )}
                </TableCell>
                {!props.asCoach && (
                  <>
                    <TableCell align="right">
                      {getCurrencyDisplayWithPrice(
                        session.total_margin_value || 0,
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {getCurrencyDisplayWithPrice(
                        (session.total_margin_value || 0) -
                          (session.coach_total_payment || 0),
                      )}
                    </TableCell>
                  </>
                )}
                {!props.hideRuleSetter && (
                  <TableCell>
                    <CoachPaymentRuleSelector
                      id="payment_rule_per_session"
                      coachPaymentRulesList={coachPaymentRulesList}
                      selected={session.coach_payment_rule}
                      isOverride
                      enableReset
                      onChange={({ value }: { value: number }) => {
                        setSessionCoachPaymentRule({
                          sessionId: session.session_id,
                          coachPaymentRuleId: value,
                          associatedCoachId: coach.associated_coach_id,
                        });
                      }}
                    />
                  </TableCell>
                )}
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
    justifyContent: 'space-between',
  },
  flexStartContainer: {
    justifyContent: 'flex-start',
  },
  tableRowError: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
}));

export default CoachPerformanceSessionTable;
