// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { PAYMENT_RULE_CALCULATION_MARGIN_VALUE } from '@bsport/common/lib/master-data/payment-rule';
import withConfirm from '../../../hocs/with-confirm.hoc';

import type { PaymentRule } from '../../../api/types';

type Props = {
  items: PaymentRule[],
  onEditPaymentRule: (PaymentRule) => void,
  onDeletePaymentRule: (PaymentRule) => void,
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

export function PaymentRuleTable(props: Props) {
  const { t } = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('name')}</TableCell>
          <TableCell>{t('base_price')}</TableCell>
          <TableCell>{t('coaches')}</TableCell>
          <TableCell>{t('actions')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.items.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell>{rule.name}</TableCell>
            <TableCell>
              {rule.calculation_method === PAYMENT_RULE_CALCULATION_MARGIN_VALUE
                ? `${rule.base_percent}%`
                : rule.base_price}
            </TableCell>
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

export default withNamespaces(['paymentRules'])(PaymentRuleTable);
