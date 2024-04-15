import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

type Props = {
  open: boolean;
};

const StaffLocationBlocker: React.FC<Props> = ({ open }) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();

  return (
    <Dialog open={open}>
      <DialogTitle>{t(`modals.locationBlocker.title`)}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="body1">
          {t(`modals.locationBlocker.message`)}
        </Typography>
        <Typography color="textSecondary" variant="caption">
          {t(`modals.locationBlocker.description`)}
        </Typography>
      </DialogContent>
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

export default React.memo(StaffLocationBlocker);
