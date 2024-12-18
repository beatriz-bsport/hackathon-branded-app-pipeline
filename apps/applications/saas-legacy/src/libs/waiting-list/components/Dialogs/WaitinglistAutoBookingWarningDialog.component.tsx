import React from 'react';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const WaitinglistAutoBookingWarningDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('waitingList');

  return (
    <GenericResponsiveDialog
      fullScreenBreakpoint="xs"
      maxWidth="xs"
      onClose={onClose}
      open={open}
    >
      <DialogTitle>{t('dialog.autoBooking.warning.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText align="left" variant="body1">
          {t('dialog.autoBooking.warning.content')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('dialog.cancel')}</Button>
        <Button color="primary" onClick={onConfirm}>
          {t('dialog.confirm')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default React.memo(WaitinglistAutoBookingWarningDialog);
