// @ts-nocheck
import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

const FinalizeInvoiceDialog = (props: Props) => {
  const { open, onSubmit, onClose } = props;
  const { t } = useTranslation();
  return (
    <GenericResponsiveDialog open={open} onClose={onClose}>
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
    </GenericResponsiveDialog>
  );
};

export default FinalizeInvoiceDialog;
