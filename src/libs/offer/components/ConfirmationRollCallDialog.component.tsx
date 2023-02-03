import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles, useTheme } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { OptionCallback } from '../../../state/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import ValidationIcon from '#components/icons/ValidationIcon.component';

export type Props = {
  open: boolean;
  initialValidatedRollCall: boolean;
  nbRemainingRollCall: number;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: (options?: OptionCallback) => void;
};
export const ConfirmationRollCallDialog = (props: Props) => {
  const { t } = useTranslation(['offer', 'common']);
  const classes = useStyles();
  const theme = useTheme();
  const [validatedRollCall, setValidatedRollCall] = useState(
    props.initialValidatedRollCall,
  );
  const onClickHandler = () =>
    props.onConfirm({ onSuccess: () => setValidatedRollCall(true) });

  if (validatedRollCall) {
    return (
      <GenericResponsiveDialog maxWidth="sm" open={props.open}>
        <div className={classes.validationIcon}>
          <ValidationIcon
            color={theme.palette.success.main}
            fillOpacity="0.08"
          />
        </div>
        <Typography variant="h6" className={classes.title}>
          {t('rollCall.dialog.validatedRollCall')}
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          {t('rollCall.dialog.savedRollCall')}
        </Typography>
        <div className={classes.alignMiddle}>
          <Button onClick={props.onCancel}>{t('close')}</Button>
        </div>
      </GenericResponsiveDialog>
    );
  }
  return (
    <GenericResponsiveDialog maxWidth="sm" open={props.open}>
      <DialogTitle>
        <Typography variant="h6" className={classes.bold}>
          {t('rollCall.dialog.validationRollCall')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {t('rollCall.dialog.confirmationRollCall', {
            count: props.nbRemainingRollCall,
          })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button className={classes.grey} onClick={props.onCancel}>
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onClickHandler}
          disabled={props.isLoading}
        >
          {t('confirm')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  grey: {
    color: theme.palette.text.secondary,
  },
  bold: {
    fontWeight: 500,
  },
  validationIcon: {
    paddingTop: theme.spacing(3),
    display: 'table',
    margin: 'auto',
  },
  title: {
    textAlign: 'center',
    fontWeight: 500,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
  alignMiddle: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
  },
}));

export default ConfirmationRollCallDialog;
