import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { CustomMuiIcon } from '#components/icons/CustomMuiIcon.component';

type Props = {
  open: boolean;
  handleClose: () => void;
  sendMessageOnClick: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

export const CommunicationSMSCostReminderModal: React.FC<Props> = ({
  open,
  handleClose,
  sendMessageOnClick,
}) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();
  return (
    <Dialog onClose={handleClose} open={open}>
      <CustomMuiIcon
        customClassName={classes.warningIcon}
        customColor="#ff9800"
        defaultBackGround={false}
        MuiIcon={WarningRoundedIcon}
      />
      <DialogTitle className={classes.dialogTitle}>
        {t('sendMessage.smsCostReminderModal.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText align="center" className={classes.dialogContentText}>
          {t('sendMessage.smsCostReminderModal.content')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose} variant="text">
          {t('sendMessage.smsCostReminderModal.cancel')}
        </Button>
        <Button color="primary" onClick={sendMessageOnClick} variant="text">
          {t('sendMessage.smsCostReminderModal.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    textAlign: 'center',
  },
  dialogContentText: { margin: 0 },
  warningIcon: {
    height: theme.spacing(9),
    width: theme.spacing(9),
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    alignSelf: 'center',
    margin: theme.spacing(2, 3),
  },
}));
export default React.memo(CommunicationSMSCostReminderModal);
