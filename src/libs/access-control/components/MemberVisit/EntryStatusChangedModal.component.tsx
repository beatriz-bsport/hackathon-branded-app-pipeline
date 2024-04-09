import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import { EntryStatus } from '#libs/access-control/constants';

type Props = {
  open: boolean;
  onCloseMemberPage: () => void;
  onStayOnMemberPage: () => void;
  entryStatus: EntryStatus;
};

const EntryStatusChangedModal: React.FC<Props> = ({
  open,
  onCloseMemberPage,
  onStayOnMemberPage,
  entryStatus,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  if (entryStatus === EntryStatus.UNKNOWN) {
    return null;
  }

  return (
    <Dialog onClose={onCloseMemberPage} open={open}>
      <DialogTitle>
        {t(`modals.entryStatusChanged.${entryStatus}.title`)}
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="body1">
          {t(`modals.entryStatusChanged.${entryStatus}.message`)}
        </Typography>
        <Typography color="textSecondary" variant="caption">
          {t(`modals.entryStatusChanged.${entryStatus}.description`)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseMemberPage}>
          {t(`modals.entryStatusChanged.close`)}
        </Button>
        <Button autoFocus color="primary" onClick={onStayOnMemberPage}>
          {t(`modals.entryStatusChanged.stay`)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export default React.memo(EntryStatusChangedModal);
