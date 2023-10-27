import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  checkIcon: {
    color: theme.palette.success.main,
    fontSize: 100,
    marginBottom: theme.spacing(2),
  },
  modalFooter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(1),
  },
  button: {
    color: theme.palette.text.secondary,
  },
}));

export type Props = {
  upsellPackageName: string;
  onClose: () => void;
  open: boolean;
};

const UpsellSubscriptionConfirmationDialog: React.FC<Props> = ({
  upsellPackageName,
  onClose,
  open,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['common', 'platformBilling']);

  return (
    <Dialog open={open}>
      <DialogContent className={classes.modalBody}>
        <CheckCircleIcon className={classes.checkIcon} />
        <Typography variant="h6">
          {t('upsellPackage.subscriptionForm.confirmationMessage', {
            name: upsellPackageName,
            ns: 'platformBilling',
          })}
        </Typography>
      </DialogContent>
      <DialogActions className={classes.modalFooter}>
        <Button className={classes.button} onClick={onClose}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(UpsellSubscriptionConfirmationDialog);
