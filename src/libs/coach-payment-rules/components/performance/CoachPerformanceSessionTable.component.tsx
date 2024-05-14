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
// @ts-ignore
import CoachPaymentRuleSelector from '../coach-payment-rule-selector/CoachPaymentRuleSelector.component';
import type { CoachPaymentRule, CoachPerformance } from '../../types';
import { downloadAsCsv } from '../../../../utils/downloader';
import { getCurrencyDisplayWithPrice } from '../../../theme/selectors';
import {
  formatISOStringAsTime,
  formatMinutes,
} from '../../../../utils/datetime';
import type { Coach } from '#libs/associated-coach/types';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

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
  handlePdfExportation?: () => void;
  disablePdfButton?: boolean;
  has_coach_access_to_compensation_downloading?: boolean;
  isMultiLocalizationEnabled: boolean;
  filtersApplied: boolean;
};

export function CoachPerformanceSessionTable(props: Props) {
  const {
    coach,
    coachPaymentRulesList,
    setSessionCoachPaymentRule,
    performances,
    handlePdfExportation,
    disablePdfButton,
    has_coach_access_to_compensation_downloading,
    isMultiLocalizationEnabled,
    filtersApplied,
  } = props;
  const { t } = useTranslation('coachPerformance');
  const classes = useStyles(!!props.displayChip);
  const coach_payment_error =
    performances && performances.find((perf) => perf.error);

  return (
    <div>
      <div
        className={clx([
          classes.flexHeaderContainer,
          props.asCoach &&
          props.displayChip &&
          !has_coach_access_to_compensation_downloading
            ? classes.flexStartContainer
            : null,
        ])}
      >
        {props.displayChip && (
          <Chip
            color="primary"
            label={
              <Typography variant="subtitle2">
                {t('paymentRules:tabs.session')}
              </Typography>
            }
            style={{ marginTop: 15, marginLeft: 10 }}
            variant="outlined"
          />
        )}
        <ObjectLevelPermissionProviderComponent requiredPermission="export.allowed_actions.payroll">
          {(hasPermission) =>
            !(props.asCoach && !has_coach_access_to_compensation_downloading) &&
            hasPermission && (
              <div className={classes.downloadButtonsContainer}>
                <Button
                  className={classes.buttonCSV}
                  color="primary"
                  disabled={!performances}
                  onClick={() =>
                    downloadAsCsv(
                      [
                        t('fields.name'),
                        t('fields.date'),
                        t('fields.duration'),
                        t('fields.establishment'),
                        isMultiLocalizationEnabled && t('fields.location'),
                        !props.asCoach && t('fields.confirmed_bookings'),
                        !props.asCoach &&
                          t('fields.noShowsAndLateCancellations'),
                        !props.asCoach && t('fields.base'),
                        !props.asCoach && t('fields.bonus'),
                        t('fields.total'),
                        !props.asCoach && t('fields.rule'),
                      ],
                      performances.map((session) => [
                        session.session_name,
                        `${moment(session.date_start).format(
                          'L',
                        )} ${formatISOStringAsTime(session.date_start)}`,
                        session.duration_minute,
                        session.establishment_title,
                        isMultiLocalizationEnabled &&
                          session.establishment_group_names?.join(', '),
                        !props.asCoach && session.confirmed_bookings,
                        !props.asCoach && session.cancelled_bookings,
                        !props.asCoach && session.base_remuneration,
                        !props.asCoach && session.coach_bonus,
                        session.coach_total_payment,
                        !props.asCoach &&
                          (
                            coachPaymentRulesList.find(
                              (coachPaymentRule) =>
                                coachPaymentRule.id ===
                                session.coach_payment_rule,
                            ) || { name: 'default' }
                          ).name,
                      ]),
                      `payroll${filtersApplied ? '-filtered' : ''}.csv`,
                    )
                  }
                  variant="contained"
                >
                  <AttachIcon style={{ marginRight: 12 }} />
                  {t('table.downloadCSV')}
                </Button>
                <Button
                  className={classes.buttonPDF}
                  color="secondary"
                  disabled={!performances || disablePdfButton}
                  onClick={handlePdfExportation}
                  variant="contained"
                >
                  <AttachIcon style={{ marginRight: 12 }} />
                  {t('table.downloadPDF')}
                </Button>
              </div>
            )
          }
        </ObjectLevelPermissionProviderComponent>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">{t('fields.name')}</TableCell>
            <TableCell align="right">{t('fields.date')}</TableCell>
            <TableCell align="right">{t('fields.duration')}</TableCell>
            <TableCell align="right">{t('fields.establishment')}</TableCell>
            {isMultiLocalizationEnabled && (
              <TableCell align="right">{t('fields.location')}</TableCell>
            )}
            {!props.asCoach && (
              <>
                <TableCell align="right">
                  {t('fields.confirmed_bookings')}
                </TableCell>
                <TableCell align="right">
                  {t('fields.noShowsAndLateCancellations')}
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
                  {`${moment(session.date_start).format(
                    'L',
                  )} ${formatISOStringAsTime(session.date_start)}`}
                </TableCell>
                <TableCell align="right">
                  {formatMinutes(session.duration_minute, t)}
                </TableCell>
                <TableCell align="right">
                  {session.establishment_title}
                </TableCell>
                {isMultiLocalizationEnabled && (
                  <TableCell align="right">
                    {session.establishment_group_names?.join(', ')}
                  </TableCell>
                )}
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
                      enableReset
                      isOverride
                      coachPaymentRulesList={coachPaymentRulesList}
                      id="payment_rule_per_session"
                      onChange={({ value }: { value: number }) => {
                        setSessionCoachPaymentRule({
                          sessionId: session.session_id,
                          coachPaymentRuleId: value,
                          associatedCoachId: coach.associated_coach_id,
                        });
                      }}
                      selected={session.coach_payment_rule}
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

const useStyles = makeStyles((theme) => ({
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
  downloadButtonsContainer: {
    display: 'flex',
    flexDirection: (reverse) => (reverse ? 'row-reverse' : 'row'),
  },
  buttonCSV: {
    margin: theme.spacing(1.5),
    color: '#fff',
  },
  buttonPDF: {
    margin: theme.spacing(1.5),
    color: '#fff',
  },
}));

export default CoachPerformanceSessionTable;
