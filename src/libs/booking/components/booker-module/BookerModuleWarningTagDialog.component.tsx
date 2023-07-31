import React from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const BookerModuleWarningTagDialog = (props: Props) => {
  const { open, onConfirm, onCancel } = props;
  const { t } = useTranslation('booking');
  return (
    <Dialog open={open}>
      <DialogTitle>
        {t('bookingModule.tags.managerDialogWarningDialog.title')}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {t('bookingModule.tags.managerDialogWarningDialog.content')}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="text" color="secondary" onClick={() => onCancel()}>
          {t('bookingModule.tags.managerDialogWarningDialog.cancel')}
        </Button>

        <Button variant="text" color="primary" onClick={() => onConfirm()}>
          {t('bookingModule.tags.managerDialogWarningDialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default BookerModuleWarningTagDialog;
