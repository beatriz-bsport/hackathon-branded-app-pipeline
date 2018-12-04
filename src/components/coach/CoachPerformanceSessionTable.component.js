// @flow

import React from 'react';
import moment from 'moment';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { PaymentRuleSelector } from '../../libs/payment-rules';
import type { PaymentRule } from '../../libs/payment-rules';

type Props = {
  sessions: *[],
  t: TFunction,
  paymentRules: PaymentRule[],
  setSessionPaymentRule: (number, number) => void,
};

export function CoachPerformanceTable(props: Props) {
  const { sessions, t, paymentRules, setSessionPaymentRule } = props;
  return (
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
            <TableCell>{moment(session.date_start).format('HH:mm')}</TableCell>
            <TableCell>{session.duration_minute}</TableCell>
            <TableCell>{session.nb_bookings}</TableCell>
            <TableCell>{session.base} €</TableCell>
            <TableCell>{session.bonus} €</TableCell>
            <TableCell>
              <PaymentRuleSelector
                paymentRules={paymentRules}
                selected={session.payment_rule_id}
                onChange={({ value }) =>
                  setSessionPaymentRule(session.id, value)
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default withNamespaces(['coachPerformance'])(CoachPerformanceTable);
