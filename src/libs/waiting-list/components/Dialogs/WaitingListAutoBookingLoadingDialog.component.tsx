import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  open: boolean;
};

const WaitingListAutoBookingLoadingDialog: React.FC<Props> = ({ open }) => {
  const { t } = useTranslation('waitingList');
  const classes = useStyles();

  return (
    <GenericResponsiveDialog
      fullScreenBreakpoint="xs"
      maxWidth="xs"
      open={open}
    >
      <div className={classes.dialogContent}>
        <div className={classes.circularProgress}>
          <CircularProgress />
        </div>
        <DialogTitle>{t('dialog.autoBooking.loading.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography align="left" variant="body1">
              {t('dialog.autoBooking.loading.content')}
            </Typography>
          </DialogContentText>
        </DialogContent>
      </div>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    paddingTop: theme.spacing(7),
    paddingBottom: theme.spacing(7),
  },
  circularProgress: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default React.memo(WaitingListAutoBookingLoadingDialog);
