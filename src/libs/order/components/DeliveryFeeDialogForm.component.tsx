// @ts-nocheck
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withTranslation, WithTranslation } from 'react-i18next';

import DeliveryFeeForm from '#libs/order/components/DeliveryFeeForm.component';
import type {
  DeliveryFee,
  DeliveryFeeCreationOrUpdatePayload,
} from '#libs/order/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeliveryFeeCreationOrUpdatePayload) => void;
  deliveryFee?: DeliveryFee;
} & WithTranslation;

export const DeliveryFeeDialogForm: React.FC<Props> = (props) => (
  <Dialog onClose={props.onClose} open={props.open}>
    <DialogTitle>{props.t('deliveryFee.forms.title')}</DialogTitle>
    <DialogContent>
      <DeliveryFeeForm
        initial={props.deliveryFee}
        onCancel={props.onClose}
        onSubmit={(data: DeliveryFeeCreationOrUpdatePayload) => {
          props.onSubmit(data);
          props.onClose();
        }}
      />
    </DialogContent>
  </Dialog>
);

export default withTranslation(['order'])(DeliveryFeeDialogForm);
