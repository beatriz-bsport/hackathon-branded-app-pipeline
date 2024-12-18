// @flow

import React from 'react';

import { withTranslation, TFunction } from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import withConfirm from '../../../hocs/with-confirm.hoc';

import type { CoachPaymentRule } from '../types';

type Props = {
  items: CoachPaymentRule[],
  onEditPaymentRule: (CoachPaymentRule: CoachPaymentRule) => void,
  onDeletePaymentRule: (CoachPaymentRule: CoachPaymentRule) => void,
  t: TFunction,
};

const ButtonWithConfirm = withConfirm(Button, 'onClick', {
  title: 'paymentRules:modal.delete.title',
  cancel: 'paymentRules:modal.delete.cancel',
  confirm: 'paymentRules:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('paymentRules:modal.delete.content')}</p>
  ),
});

export function CoachPaymentRuleTable(props: Props) {
  const { t } = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('coach_payment_rules.name')}</TableCell>
          <TableCell>{t('coach_payment_rules.base_remuneration')}</TableCell>
          <TableCell>{t('coach_payment_rules.min_remuneration')}</TableCell>
          <TableCell>{t('coach_payment_rules.max_remuneration')}</TableCell>
          <TableCell>{t('coach_payment_rules.coaches')}</TableCell>
          <TableCell>{t('coach_payment_rules.actions')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.items.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell>{rule.name}</TableCell>

            <TableCell>
              {
                // eslint-disable-next-line
                parseFloat(rule.base_remuneration) === 0
                  ? rule.bonus_coach_payment.find(
                      (bonus) => bonus.applicability === 0 && bonus.kind === 2,
                    )
                    ? `${
                        rule.bonus_coach_payment.find(
                          (bonus) =>
                            bonus.applicability === 0 && bonus.kind === 2,
                        ).bonus
                      }%`
                    : 0
                  : rule.base_remuneration
              }
            </TableCell>
            <TableCell>{rule.min_remuneration}</TableCell>
            <TableCell>{rule.max_remuneration}</TableCell>
            <TableCell>{rule.coaches.map((c) => c.name).join(', ')}</TableCell>
            <TableCell>
              <Button onClick={() => props.onEditPaymentRule(rule)}>
                <EditIcon />
              </Button>
              <ButtonWithConfirm
                onClick={() => props.onDeletePaymentRule(rule)}
              >
                <DeleteIcon />
              </ButtonWithConfirm>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default withTranslation(['paymentRules'])(CoachPaymentRuleTable);
