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
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  open: boolean,
  onSubmit: () => void,
  onClose: () => void,
  t: TFunction,
};

export function FinalizeInvoiceDialog(props: Props) {
  const { open, onSubmit, onClose, t } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('invoice.finalize')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('invoice.explainFinalize')}
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

export default withNamespaces()(FinalizeInvoiceDialog);
