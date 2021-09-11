// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import DeliveryFeeForm from './DeliveryFeeForm.component';
import type { DeliveryFee } from '../types';

type Props = {
  open: boolean,
  onClose: () => void,
  onSubmit: (data: any) => void,
  deliveryFee: ?DeliveryFee,
  t: TFunction,
};

export const DeliveryFeeDialogForm = (props: Props) => (
  <Dialog open={props.open} onClose={props.onClose}>
    <DialogTitle>{props.t('deliveryFee.forms.title')}</DialogTitle>
    <DialogContent>
      <DeliveryFeeForm
        initial={props.deliveryFee}
        onSubmit={(data) => {
          props.onSubmit(data);
          props.onClose();
        }}
        onCancel={props.onClose}
      />
    </DialogContent>
  </Dialog>
);

export default withTranslation(['order'])(DeliveryFeeDialogForm);
