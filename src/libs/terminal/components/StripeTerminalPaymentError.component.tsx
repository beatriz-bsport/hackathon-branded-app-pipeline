import React from 'react';
import { ExposedError } from '@stripe/terminal-js';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ErrorIcon from '#components/icons/ErrorIcon.component';
import CardRefusedIcon from '#components/icons/CardRefusedIcon.component';
import StripeTerminalErrorCode from './StripeTerminalErrorCode.component';

const useStyles = makeStyles((theme: Theme) => ({
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    textAlign: 'center',
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
    marginBottom: theme.spacing(2),
  },
  redText: {
    color: theme.palette.error.dark,
  },
  textSecondary: {
    color: theme.palette.text.secondary,
  },
}));

type Props = {
  onCancel?: () => void;
  onRetry: () => void;
  error: ExposedError;
  isSetupIntent: boolean;
};

export const StripeTerminalPaymentError = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation(['invoice']);
  const translationKey = props.isSetupIntent ? 'setupIntent' : 'paymentIntent';

  /*
  When trying to save an Interac card via a SetupIntent, the error has the following format
    {code: "setup_intent_invalid_parameter"
    message: "The payment method type \"interac_present\" is invalid. See https://stripe.com/docs/api/setup_intents/create#create_setup_intent-payment_method_types
      for the full list of supported payment method types. Please also ensure the provided types are activated in your dashboard
      (https://dashboard.stripe.com/account/payments/settings) and your account is enabled for any features that you are trying to use."
    setup_intent: null}
  */

  const isInteracError = React.useMemo(
    () =>
      props.error.code === 'setup_intent_invalid_parameter' &&
      props.error.message?.includes('interac_present'),
    [props.error],
  );

  return (
    <div className={classes.centerContainer}>
      {isInteracError ? (
        <>
          <div className={classes.errorIcon}>
            <CardRefusedIcon />
          </div>
          <Typography className={classes.errorTitle} variant="h6">
            {t(
              'configuration.stripeTerminal.paymentDialog.paymentFailed.interac.title',
            )}
          </Typography>
          <Typography className={classes.errorMessage}>
            {t(
              'configuration.stripeTerminal.paymentDialog.paymentFailed.interac.content',
            )}
          </Typography>
        </>
      ) : (
        <>
          <div className={classes.errorIcon}>
            <ErrorIcon />
          </div>
          <Typography className={classes.errorTitle} variant="h6">
            {t(
              `configuration.stripeTerminal.paymentDialog.paymentFailed.title.${translationKey}`,
            )}
          </Typography>
          <Typography
            className={classNames(classes.errorMessage, classes.redText)}
          >
            {t(
              `configuration.stripeTerminal.paymentDialog.paymentFailed.content.${translationKey}`,
            )}
          </Typography>
          <StripeTerminalErrorCode error={props.error} />
        </>
      )}

      <DialogActions>
        {props.onCancel && (
          <Button
            className={classes.textSecondary}
            onClick={() => props.onCancel()}
          >
            {t('common:cancel')}
          </Button>
        )}
        <Button
          color="primary"
          onClick={() => props.onRetry()}
          variant="contained"
        >
          {t('configuration.stripeTerminal.connectDialog.form.retry')}
        </Button>
      </DialogActions>
    </div>
  );
};

export default StripeTerminalPaymentError;
