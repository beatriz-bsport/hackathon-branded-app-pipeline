import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

import RedButton from '#components/button/RedButton.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
  hasSubscription: boolean;
};

const RevertInvoiceDialog = (props: Props) => {
  const { hasSubscription, open, onSubmit, onClose } = props;
  const { t } = useTranslation();

  return (
    <GenericResponsiveDialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{t('invoice.revert')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {hasSubscription ? (
            t('invoice.revertImpossibleExplainSubscription')
          ) : (
            <p>
              <p>{t('invoice.revertExplainPayment')}</p>
              <p>{t('invoice.revertExplainCredits')}</p>
              <p>{t('invoice.revertExplainPacks')}</p>
              <p>{t('invoice.revertExplainShop')}</p>
            </p>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t('common.cancel')}
        </Button>
        {!hasSubscription ? (
          <RedButton onClick={onSubmit}>{t('common.confirm')}</RedButton>
        ) : null}
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default RevertInvoiceDialog;
