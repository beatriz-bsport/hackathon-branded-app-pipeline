import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) => ({
  successTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(6),
  },
  cancelTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(2),
  },
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(9),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  circularProgress: {
    marginTop: theme.spacing(2),
  },
  redButton: { color: theme.palette.error.main },
  errorText: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(2),
  },
}));

type Props = {
  isSetupIntent: boolean;
  isProcessing: boolean;
  onCancel?: () => void;
  errorWhenCancelling: boolean;
};

export const StripeTerminalConnectingSuccess = (props: Props) => {
  const [displayCancelMessage, setDisplayCancelMessage] = useState(false);
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);

  if (displayCancelMessage) {
    return (
      <>
        <div>
          <Typography variant="h6" className={classes.cancelTitle}>
            {t(
              'configuration.stripeTerminal.paymentDialog.connectionSuccess.cancel.title',
            )}
          </Typography>
          <Typography>
            {t(
              'configuration.stripeTerminal.paymentDialog.connectionSuccess.cancel.cancelExplain1',
            )}
          </Typography>
          <Typography>
            {t(
              'configuration.stripeTerminal.paymentDialog.connectionSuccess.cancel.cancelExplain2',
            )}
          </Typography>
        </div>
        <DialogActions>
          <Button onClick={() => setDisplayCancelMessage(false)}>
            {t('common:cancel')}
          </Button>
          <Button
            className={classes.redButton}
            onClick={() => {
              setDisplayCancelMessage(false);
              props.onCancel();
            }}
          >
            {t('common:confirm')}
          </Button>
        </DialogActions>
      </>
    );
  }
  return (
    <>
      <div className={classes.centerContainer}>
        <Typography variant="h6" className={classes.successTitle}>
          {t('configuration.stripeTerminal.connectDialog.title.success')}
        </Typography>
        {props.isProcessing ? (
          <Typography>
            {t(
              'configuration.stripeTerminal.paymentDialog.connectionSuccess.processing',
            )}
          </Typography>
        ) : (
          <Typography>
            {t(
              `configuration.stripeTerminal.paymentDialog.connectionSuccess.${
                props.isSetupIntent ? 'intent' : 'payment'
              }`,
            )}
          </Typography>
        )}
        {props.errorWhenCancelling && (
          <Typography className={classes.errorText}>
            {t(
              'configuration.stripeTerminal.paymentDialog.connectionSuccess.cancel.error',
            )}
          </Typography>
        )}
        <CircularProgress size={30} className={classes.circularProgress} />
      </div>
      {!!props.onCancel && !props.isProcessing && (
        <DialogActions>
          <Button onClick={() => setDisplayCancelMessage(true)}>
            {t('common:cancel')}
          </Button>
        </DialogActions>
      )}
    </>
  );
};

export default StripeTerminalConnectingSuccess;
