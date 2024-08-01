import React from 'react';

import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import type { DeliveryFee } from '#src/libs/order/types';
// @ts-expect-error
import withConfirm from '#src/hocs/with-confirm.hoc';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

type Props = {
  deliveryFees: DeliveryFee[];
  onEdit: (df: DeliveryFee) => void;
  onDelete: (df: DeliveryFee) => void;
} & WithTranslation;

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
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="product.shopReworked.allowed_actions.editSettings"
          >
            <TableCell>{t('table.actions')}</TableCell>
          </ObjectLevelPermissionWrapper>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.deliveryFees?.map((df) => (
          <TableRow key={df.id}>
            <TableCell>{df.name}</TableCell>
            <TableCell>{df.fee}</TableCell>
            <TableCell>{df.free_threshold}</TableCell>
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="product.shopReworked.allowed_actions.editSettings"
            >
              <TableCell>
                <Button onClick={() => props.onEdit(df)}>
                  <EditIcon />
                </Button>
                <DeleteButtonWithConfirm
                  onClick={() => props.onDelete(df)}
                  t={t}
                >
                  <DeleteIcon />
                </DeleteButtonWithConfirm>
              </TableCell>
            </ObjectLevelPermissionWrapper>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default withTranslation(['order'])(PaymentRuleTable);
