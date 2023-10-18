import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { ValidationIcon } from '#components/icons/ValidationIcon.component';
import { ErrorIcon } from '#components/icons/ErrorIcon.component';

type Props = {
  open: boolean;
  isError: boolean;
  isDisabled: boolean;
  onClose: () => void;
};

const WaitingListAutoBookingFeedbackDialog: React.FC<Props> = ({
  open,
  isError,
  isDisabled,
  onClose,
}) => {
  const { t } = useTranslation('waitingList');
  const classes = useStyles();

  return (
    <GenericResponsiveDialog
      fullScreenBreakpoint="xs"
      maxWidth="xs"
      open={open}
    >
      <div className={classes.dialogContent}>
        <div className={classes.icon}>
          {isError ? <ErrorIcon /> : <ValidationIcon />}
        </div>
        <DialogTitle>
          {isError
            ? t('dialog.autoBooking.error.title')
            : t('dialog.autoBooking.success.title')}
        </DialogTitle>
        {isError && (
          <DialogContent>
            <DialogContentText>
              <Typography align="left" variant="body1">
                {t('dialog.autoBooking.error.content')}
              </Typography>
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button disabled={isDisabled} onClick={onClose}>
            {t('dialog.cancel')}
          </Button>
        </DialogActions>
      </div>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    paddingTop: theme.spacing(7),
  },
  icon: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default React.memo(WaitingListAutoBookingFeedbackDialog);
