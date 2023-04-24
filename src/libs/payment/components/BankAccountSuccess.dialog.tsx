// @ts-nocheck
import React from 'react';
import {
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const useStyles = makeStyles((theme: any) => ({
  note: {
    marginTop: theme.spacing(2),
  },
}));

const BankAccountSuccessDialog = (props: Props) => {
  const classes = useStyles();
  const { open, onCancel, onConfirm } = props;
  const { t } = useTranslation();

  return (
    <GenericResponsiveDialog open={open}>
      <DialogTitle>
        <Typography variant="h6">
          {t('settings:company.bankAccountSuccess.title')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {t('settings:company.bankAccountSuccess.content')}
        </Typography>

        <Typography variant="body1" className={classes.note}>
          {t('settings:company.bankAccountSuccess.note')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('common:cancel')}</Button>
        <Button color="primary" onClick={onConfirm}>
          {t('marketing:customForm.actions.configure')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default BankAccountSuccessDialog;
