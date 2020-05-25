// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
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

export default withTranslation()(FinalizeInvoiceDialog);
