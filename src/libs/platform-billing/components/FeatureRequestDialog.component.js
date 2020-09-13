// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

type Props = {
  open: boolean,
  onClose: () => void,
};

export const FeatureRequestDialog = (props: Props) => {
  const { t } = useTranslation(['platformBilling']);
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('featureRequest.title')}</DialogTitle>
      <DialogContent>{t('featureRequest.content')}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{t('featureRequest.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeatureRequestDialog;
