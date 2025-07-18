import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

import { useTranslation } from 'react-i18next';
import { makeStyles, Typography } from '@material-ui/core';
import { CustomMuiIcon } from '#src/components/icons/CustomMuiIcon.component';

type Props = {
  smsWarning?: boolean;
  recipientsPreviewWarning?: boolean;
  isEditingScheduledCommunication?: boolean;
  handleClose: () => void;
  sendMessageOnClick: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
};

export const CommunicationWarningModal: React.FC<Props> = ({
  smsWarning,
  recipientsPreviewWarning,
  isEditingScheduledCommunication,
  handleClose,
  sendMessageOnClick,
}) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();
  const getModalTitle = () => {
    if (smsWarning && !recipientsPreviewWarning) {
      return t('sendMessage.smsCostWarning.title');
    }
    return t('sendMessage.cannotReviewRecipients.title');
  };

  const getConfirmButtonText = () => {
    if (isEditingScheduledCommunication) {
      return t('sendMessage.buttons.updateScheduled');
    }
    if (smsWarning && !recipientsPreviewWarning) {
      return t('sendMessage.smsCostWarning.confirm');
    }
    return t('sendMessage.cannotReviewRecipients.confirm');
  };

  return (
    <Dialog onClose={handleClose} open={true}>
      <CustomMuiIcon
        customClassName={classes.warningIcon}
        customColor="#ff9800"
        defaultBackGround={false}
        MuiIcon={WarningRoundedIcon}
      />
      <DialogTitle className={classes.dialogTitle}>
        {getModalTitle()}
      </DialogTitle>
      <DialogContent>
        <div className={classes.dialogContentList}>
          {recipientsPreviewWarning && (
            <div className={classes.dialogRecipientsContentList}>
              <Typography>
                {t('sendMessage.cannotReviewRecipients.content.description')}
              </Typography>
              <Typography>
                {t('sendMessage.cannotReviewRecipients.content.effect')}
              </Typography>
            </div>
          )}
          {smsWarning && (
            <Typography>
              <span className={classes.dialogContentText}>
                {t('sendMessage.smsCostWarning.content.description')}
              </span>{' '}
              {t('sendMessage.smsCostWarning.content.effect')}
            </Typography>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleClose} variant="text">
          {recipientsPreviewWarning
            ? t('sendMessage.cannotReviewRecipients.cancel')
            : t('sendMessage.smsCostWarning.cancel')}
        </Button>
        <Button color="primary" onClick={sendMessageOnClick} variant="text">
          {getConfirmButtonText()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    textAlign: 'center',
  },
  dialogContentText: { fontWeight: 'bold' },
  warningIcon: {
    height: theme.spacing(9),
    width: theme.spacing(9),
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    alignSelf: 'center',
    margin: theme.spacing(2, 3),
  },
  dialogRecipientsContentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  dialogContentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));
export default React.memo(CommunicationWarningModal);
