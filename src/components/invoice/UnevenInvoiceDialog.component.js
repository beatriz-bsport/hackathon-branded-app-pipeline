// @flow
import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  open: boolean,
  onSubmit: () => void,
  onClose: () => void,
  totalItem: ?number,
  totalPayment: ?number,
  t: TFunction,
};

export function UnevenInvoiceDialog(props: Props) {
  const { open, onSubmit, onClose, totalPayment, totalItem, t } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('form.invoice.titleUnevenInvoice')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('form.invoice.explainUnevenInvoice')({
            totalInvoiceItems: totalItem || 0,
            totalPayments: totalPayment || 0,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t('common.cancel')}
        </Button>
        <Button onClick={onSubmit} color="primary" autoFocus>
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default translate()(UnevenInvoiceDialog);
