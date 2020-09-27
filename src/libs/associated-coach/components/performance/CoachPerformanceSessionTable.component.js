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

import { PaymentRuleSelector } from '../../../payment-rules';
import type { PaymentRule } from '../../../payment-rules';
import { downloadAsCsv } from '../../../../downloader';

type Props = {
  sessions: *[],
  t: TFunction,
  paymentRules: PaymentRule[],
  setSessionPaymentRule: (number, number) => void,
};

export function CoachPerformanceTable(props: Props) {
  const { sessions, t, paymentRules, setSessionPaymentRule } = props;
  return (
    <div>
      <div
        style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}
      >
        <Button
          variant="contained"
          color="primary"
          style={{ margin: 12 }}
          onClick={() =>
            downloadAsCsv(
              [
                t('fields.name'),
                t('fields.date'),
                t('fields.duration'),
                t('fields.nb_bookings'),
                t('fields.base'),
                t('fields.bonus'),
                t('fields.rule'),
              ],
              sessions.map((session) => [
                session.name,
                moment(session.date_start).format('DD/MM/YYYY HH[:]mm'),
                session.duration_minute,
                session.nb_accountable_bookings,
                `${session.base}`,
                `${session.bonus}`,
                (
                  paymentRules.find(
                    (pr) => pr.id === session.payment_rule_id,
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
          <TableCell colSpan={2}>{t('fields.date')}</TableCell>
          <TableCell>{t('fields.duration')}</TableCell>
          <TableCell>{t('fields.nb_bookings')}</TableCell>
          <TableCell>{t('fields.base')}</TableCell>
          <TableCell>{t('fields.bonus')}</TableCell>
          <TableCell>{t('fields.rule')}</TableCell>
        </TableHead>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.name}</TableCell>
              <TableCell>
                {moment(session.date_start).format('ddd Do MMM')}
              </TableCell>
              <TableCell>
                {moment(session.date_start).format('HH:mm')}
              </TableCell>
              <TableCell>{session.duration_minute}</TableCell>
              <TableCell>{session.nb_accountable_bookings}</TableCell>
              <TableCell>{session.base.toFixed(2)} €</TableCell>
              <TableCell>{session.bonus} €</TableCell>
              <TableCell>
                <PaymentRuleSelector
                  id="payment_rule_per_session"
                  paymentRules={paymentRules}
                  selected={session.payment_rule_id}
                  isOverride
                  onChange={({ value }) =>
                    setSessionPaymentRule(session.id, value)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default withTranslation(['coachPerformance'])(CoachPerformanceTable);
