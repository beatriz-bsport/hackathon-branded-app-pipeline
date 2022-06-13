import React from 'react';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ErrorIcon from '#components/icons/ErrorIcon.component';
import StripeTerminalErrorCode from './StripeTerminalErrorCode.component';

const useStyles = makeStyles((theme: Theme) => ({
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  loadingTitle: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(2),
    fontWeight: 500,
  },
  errorIcon: {
    height: '110px',
    width: '110px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  errorTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  errorMessage: {
    color: theme.palette.error.dark,
  },
}));

type Props = {
  error: any;
  onCancel?: () => void;
  onRetry: () => void;
};

export const StripeTerminalConnectingError = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);

  return (
    <div className={classes.centerContainer}>
      <div className={classes.errorIcon}>
        <ErrorIcon />
      </div>
      <Typography variant="h6" className={classes.errorTitle}>
        {t('configuration.stripeTerminal.connectDialog.title.error')}
      </Typography>
      <Typography className={classes.errorMessage}>
        {t('configuration.stripeTerminal.connectDialog.error1')}
      </Typography>
      <Typography className={classes.errorMessage}>
        {t('configuration.stripeTerminal.connectDialog.error2')}
      </Typography>
      <StripeTerminalErrorCode error={props.error} />
      <DialogActions>
        {props.onCancel && (
          <Button onClick={() => props.onCancel()}>{t('common:cancel')}</Button>
        )}
        <Button
          color="primary"
          variant="contained"
          onClick={() => props.onRetry()}
        >
          {t('configuration.stripeTerminal.connectDialog.form.retry')}
        </Button>
      </DialogActions>
    </div>
  );
};

export default StripeTerminalConnectingError;
