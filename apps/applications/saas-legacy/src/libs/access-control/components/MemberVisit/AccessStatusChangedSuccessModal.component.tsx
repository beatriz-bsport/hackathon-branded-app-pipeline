import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

type Props = {
  open: boolean;
  onClose: () => void;
};

const AccessStatusChangedSuccessModal: React.FC<Props> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation('accessControl');
  const classes = useStyles();
  return (
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      onClose={onClose}
      open={open}
    >
      <DialogTitle id="alert-dialog-title">
        {t('modals.accessStatusChangedSuccess.title')}
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <CheckCircleIcon className={classes.dialogIcon} />
        <Typography color="textSecondary" id="alert-dialog-description">
          {t('modals.accessStatusChangedSuccess.message')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('common:close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  dialogIcon: {
    fontSize: 48,
    color: theme.palette.success.main,
  },
}));

export default React.memo(AccessStatusChangedSuccessModal);
