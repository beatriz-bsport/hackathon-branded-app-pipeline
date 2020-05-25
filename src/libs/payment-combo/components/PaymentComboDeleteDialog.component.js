// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import RedButton from '../../../components/button/RedButton.component';

type Props = {
  t: TFunction,
  open: boolean,
  onClose: () => void,
  onSubmit: () => void,
};

export const PaymentComboDeleteDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <DialogTitle>{props.t('delete.title')}</DialogTitle>
      <DialogContent>{props.t('delete.content')}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{props.t('delete.cancel')}</Button>
        <RedButton onClick={props.onSubmit}>
          {props.t('delete.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default withTranslation(['paymentCombo'])(PaymentComboDeleteDialog);
