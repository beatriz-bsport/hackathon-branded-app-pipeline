// @flow

import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import type { DeliveryFee } from '../../../api/types';
import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  deliveryFees: DeliveryFee[],
  onEdit: (id: number) => void,
  onDelete: (id: number) => void,
  t: TFunction,
};

const DeleteButtonWithConfirm = withConfirm(Button, 'onClick', {
  title: 'order:deliveryFee.modal.delete.title',
  cancel: 'order:deliveryFee.modal.delete.cancel',
  confirm: 'order:deliveryFee.modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('order:deliveryFee.modal.delete.content')}</p>
  ),
});

export function PaymentRuleTable(props: Props) {
  const { t } = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('deliveryFee.name')}</TableCell>
          <TableCell>{t('deliveryFee.fee')}</TableCell>
          <TableCell>{t('deliveryFee.free_threshold')}</TableCell>
          <TableCell>{t('actions')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.deliveryFees.map((df) => (
          <TableRow key={df.id}>
            <TableCell>{df.name}</TableCell>
            <TableCell>{df.fee}</TableCell>
            <TableCell>{df.free_threshold}</TableCell>
            <TableCell>
              <Button onClick={() => props.onEdit(df)}>
                <EditIcon />
              </Button>
              <DeleteButtonWithConfirm t={t} onClick={() => props.onDelete(df)}>
                <DeleteIcon />
              </DeleteButtonWithConfirm>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default withTranslation(['order'])(PaymentRuleTable);
