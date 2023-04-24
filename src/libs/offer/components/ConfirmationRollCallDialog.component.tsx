// @ts-nocheck
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles, useTheme, Dialog } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { OptionCallback } from '../../../state/types';
import ValidationIcon from '#components/icons/ValidationIcon.component';

export type Props = {
  open: boolean;
  nbRollCallsLeftToValidate: number;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: (options?: OptionCallback) => void;
};

export const ConfirmationRollCallDialog: React.FC<Props> = (props) => {
  const { t } = useTranslation(['offer', 'common']);
  const classes = useStyles();
  const theme = useTheme();
  const [isRollCallValidated, setIsRollCallValidated] = useState(false);
  const onClickHandler = () =>
    props.onConfirm({
      onSuccess: () => {
        setIsRollCallValidated(true);
      },
    });

  const onClose = () => {
    setIsRollCallValidated(false);
    props.onCancel();
  };

  if (isRollCallValidated) {
    return (
      <Dialog open={props.open}>
        <div className={classes.validationIcon}>
          <ValidationIcon
            color={theme.palette.success.main}
            fillOpacity="0.08"
          />
        </div>
        <DialogContent>
          <Typography variant="h6" className={classes.title}>
            {t('rollCall.dialog.validatedRollCall', {
              count: props.nbRollCallsLeftToValidate,
            })}
          </Typography>
          <Typography variant="body1" className={classes.subtitle}>
            {t('rollCall.dialog.savedRollCall', {
              count: props.nbRollCallsLeftToValidate,
            })}
          </Typography>
        </DialogContent>
        <div className={classes.alignMiddle}>
          <Button onClick={onClose}>{t('close')}</Button>
        </div>
      </Dialog>
    );
  }
  return (
    <Dialog maxWidth="sm" open={props.open}>
      <DialogTitle>
        <Typography variant="h6" className={classes.bold}>
          {t('rollCall.dialog.validationRollCall')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {t('rollCall.dialog.confirmationRollCall', {
            count: props.nbRollCallsLeftToValidate,
          })}
        </Typography>
      </DialogContent>
      <div className={classes.buttonContainer}>
        <DialogActions>
          <Button className={classes.grey} onClick={onClose}>
            {t('common:cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onClickHandler}
            disabled={props.isLoading}
          >
            {t('common:confirm')}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
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
  buttonContainer: {
    marginBottom: theme.spacing(1),
  },
}));

export default ConfirmationRollCallDialog;
