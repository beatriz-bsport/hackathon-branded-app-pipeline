import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

import { Trans, useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { CustomMuiIcon } from '#src/components/icons/CustomMuiIcon.component';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  sendMessageOnClick: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

const SmsCostWarningModal: React.FC<Props> = ({
  isOpen,
  handleClose,
  sendMessageOnClick,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  return (
    <Dialog onClose={handleClose} open={isOpen}>
      <CustomMuiIcon
        customClassName={classes.warningIcon}
        customColor="#ff9800"
        defaultBackGround={false}
        MuiIcon={WarningRoundedIcon}
      />
      <DialogTitle className={classes.dialogTitle}>
        {t('audience.smsWarning.modal.title')}
      </DialogTitle>
      <DialogContent className={classes.dialogContentContainer}>
        <Trans i18nKey="audience.smsWarning.modal.content" t={t} />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose} variant="text">
          {t('audience.smsWarning.modal.actions.secondary')}
        </Button>
        <Button color="primary" onClick={sendMessageOnClick} variant="text">
          {t('audience.smsWarning.modal.actions.primary')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    textAlign: 'center',
  },
  dialogContentContainer: {
    maxWidth: '400px',
    textAlign: 'center',
  },
  warningIcon: {
    height: theme.spacing(9),
    width: theme.spacing(9),
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    alignSelf: 'center',
    margin: theme.spacing(2, 3),
  },
}));
export default React.memo(SmsCostWarningModal);
