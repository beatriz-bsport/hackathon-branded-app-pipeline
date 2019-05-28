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

import RedButton from '../../../components/button/RedButton.component';

type Props = {
  open: boolean,
  onSubmit: () => void,
  onClose: () => void,
  hasSubscription: boolean,
  t: TFunction,
};

export function FinalizeInvoiceDialog(props: Props) {
  const { hasSubscription, open, onSubmit, onClose, t } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
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
    </Dialog>
  );
}

export default withNamespaces()(FinalizeInvoiceDialog);
