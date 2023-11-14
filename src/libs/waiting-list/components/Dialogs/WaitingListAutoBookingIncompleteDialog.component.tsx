import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import type { Member } from '#libs/member/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onContinueBookingOptions: () => void;
  registeredMemberList: Array<Member>;
  unregisteredMemberList: Array<Member>;
};

const WaitingListAutoBookingIncompleteDialog: React.FC<Props> = ({
  open,
  registeredMemberList,
  unregisteredMemberList,
  onClose,
  onContinueBookingOptions,
}) => {
  const { t } = useTranslation('waitingList');
  const classes = useStyles();
  const cleanRegisteredMemberList = registeredMemberList.filter(
    (m) => !!m && m.id,
  );
  const cleanUnregisteredMemberList = unregisteredMemberList.filter(
    (m) => !!m && m.id,
  );

  return (
    <GenericResponsiveDialog
      fullScreenBreakpoint="xs"
      maxWidth="xs"
      open={open}
    >
      <div className={classes.dialogContent}>
        <div className={classes.icon}>
          <HourglassEmptyIcon style={{ height: 120, width: 120 }} />
        </div>
        <DialogTitle>{t('dialog.autoBooking.incomplete.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {!!(cleanRegisteredMemberList || []).length && (
              <>
                <Typography align="left" variant="body1">
                  {t('dialog.autoBooking.incomplete.content.registered')}
                </Typography>
                <div className={classes.memberLines}>
                  {(cleanRegisteredMemberList || []).map((member) => (
                    <Typography key={member.id} align="left" variant="body2">
                      {` - ${member?.name || ''} ${member?.email || ''}`}
                    </Typography>
                  ))}
                </div>
              </>
            )}
            <Typography align="left" variant="body1">
              {t('dialog.autoBooking.incomplete.content.unregistered')}
            </Typography>
            <div className={classes.memberLines}>
              {(cleanUnregisteredMemberList || []).map((member) => (
                <Typography key={member.id} align="left" variant="body2">
                  {` - ${member?.name || ''} ${member?.email || ''}`}
                </Typography>
              ))}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            {t('dialog.autoBooking.incomplete.actions.ok')}
          </Button>
          {!!(cleanUnregisteredMemberList || []).length && (
            <Button color="primary" onClick={onContinueBookingOptions}>
              {t('dialog.autoBooking.incomplete.actions.bookThem')}
            </Button>
          )}
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
  memberLines: {
    '&>*': {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    marginBottom: theme.spacing(1),
  },
}));

export default React.memo(WaitingListAutoBookingIncompleteDialog);
