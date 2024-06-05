import React from 'react';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ErrorIcon from '#components/icons/ErrorIcon.component';
import CardRefusedIcon from '#components/icons/CardRefusedIcon.component';
import type { StripeAPIException } from '#libs/payment/types';
import StripeTerminalErrorCode from '../StripeTerminalErrorCode.component';

const useStyles = makeStyles((theme: Theme) => ({
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  bottomContainer: {
    width: '100%',
    textAlign: 'right',
    paddingTop: theme.spacing(2),
  },
  dialogActions: {
    paddingBottom: 0,
  },
}));

export type Props = {
  onClose: () => void;
  error: StripeAPIException | null;
  isSetupIntent: boolean;
};

export const StripeTerminalError: React.FC<Props> = ({
  onClose,
  error = { code: 'unknown' },
  isSetupIntent,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('invoice');
  const translationKey = isSetupIntent ? 'setupIntent' : 'paymentIntent';

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
      error?.code === 'setup_intent_invalid_parameter' &&
      error?.message?.includes('interac_present'),
    [error],
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
          <StripeTerminalErrorCode error={error} />
        </>
      )}

      <div className={classes.bottomContainer}>
        <Divider />
        <DialogActions className={classes.dialogActions}>
          <Button onClick={onClose}>{t('common:cancel')}</Button>
        </DialogActions>
      </div>
    </div>
  );
};

export default React.memo(StripeTerminalError);
