// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

const PrivateBookingSetUnpaidConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
}: Props) => {
  const { t } = useTranslation(['privateService']);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{t('privateBooking.setUnpaid.confirmTitle')}</DialogTitle>
      <DialogContent>
        <Typography>{t('privateBooking.setUnpaid.confirmMessage')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" disabled={loading} onClick={onClose}>
          {t('privateBooking.setUnpaid.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={loading}
          onClick={onConfirm}
          variant="contained"
        >
          {t('privateBooking.setUnpaid.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrivateBookingSetUnpaidConfirmDialog;
