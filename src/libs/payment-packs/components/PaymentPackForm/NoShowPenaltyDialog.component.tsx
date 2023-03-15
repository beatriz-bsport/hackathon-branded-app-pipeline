import React from 'react';

import { useTranslation } from 'react-i18next';
import { Typography, makeStyles } from '@material-ui/core';

import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

export type Props = {
  open: boolean;
  onClose: () => void;
  goToSettings: () => void;
};

export const NoShowPenaltyDialog: React.FC<Props> = (props) => {
  const { t } = useTranslation(['paymentPack', 'common']);
  const classes = useStyles();
  return (
    <GenericResponsiveDialog maxWidth="sm" open={props.open}>
      <DialogTitle>
        {t('form.paymentPack.penalty.noShowDialog.title')}
      </DialogTitle>
      <DialogContent>
        {t('form.paymentPack.penalty.noShowDialog.text')}
        <Alert severity="info" className={classes.alert}>
          <Typography>
            {t('form.paymentPack.penalty.noShowDialog.alert')}
          </Typography>
        </Alert>
      </DialogContent>
      <div className={classes.buttonContainer}>
        <DialogActions>
          <Button onClick={props.onClose}>{t('common:close')}</Button>
          <Button
            onClick={props.goToSettings}
            variant="contained"
            color="primary"
          >
            {t('common:params')}
          </Button>
        </DialogActions>
      </div>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  alert: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  buttonContainer: {
    marginBottom: theme.spacing(1),
  },
}));

export default NoShowPenaltyDialog;
