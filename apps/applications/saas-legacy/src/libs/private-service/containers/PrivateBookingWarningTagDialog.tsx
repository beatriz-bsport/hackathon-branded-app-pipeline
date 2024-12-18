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

const PrivateBookingWarningTagDialog: React.FC<Props> = ({
  open,
  onConfirm,
  onCancel,
}: Props) => {
  const { t } = useTranslation('privateService');
  return (
    <Dialog open={open}>
      <DialogTitle>
        {t('privateBooking.incompatibleTagsDialog.title')}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {t('privateBooking.incompatibleTagsDialog.description')}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button color="secondary" onClick={() => onCancel()} variant="text">
          {t('privateBooking.incompatibleTagsDialog.cancel')}
        </Button>

        <Button color="primary" onClick={() => onConfirm()} variant="text">
          {t('privateBooking.incompatibleTagsDialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default React.memo(PrivateBookingWarningTagDialog);
