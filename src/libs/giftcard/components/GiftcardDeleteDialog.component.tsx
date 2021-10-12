// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';

import { useTranslation } from 'react-i18next';

import RedButton from '../../../components/button/RedButton.component';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export const GiftcardDeleteDialog = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('delete.title')}</DialogTitle>
      <DialogContent>{t('delete.content')}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{t('delete.cancel')}</Button>
        <RedButton onClick={props.onSubmit}>{t('delete.submit')}</RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default GiftcardDeleteDialog;
