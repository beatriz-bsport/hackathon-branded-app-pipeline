import React from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';

type Props = {
  open: boolean;
  onConfirm: () => void;
};

export const PrivatePassDeleteDialog = (props: Props) => {
  const { t } = useTranslation('paymentPack');
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('universalPass.restore.dialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>{t('universalPass.restore.dialog.text')}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="primary"
          onClick={() => props.onConfirm()}
        >
          {t('universalPass.restore.dialog.continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrivatePassDeleteDialog;
