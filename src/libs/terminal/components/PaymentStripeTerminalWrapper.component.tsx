// @ts-nocheck
import React, { useState, useEffect } from 'react';

import ErrorIcon from '@material-ui/icons/Error';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import StripeErrorCode from '#libs/payment/components/payment-backend-stripe/StripeErrorCode.component';
import PaymentStripeTerminal from '#libs/terminal/components/PaymentStripeTerminal.component';
import type { StripeReader } from '#libs/terminal/types';

const useStyles = makeStyles((theme: Theme) => ({
  centered: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

type OwnProps = {
  requestSetupIntentSecret: () => Promise<any>;
  stripeReaders: StripeReader[];
  onCancel?: () => void;
  onSuccess: () => void;
  isSetupIntent: boolean;
  setProcessing?: (value: boolean) => void;
  companyId: number;
};

type Props = OwnProps;

export const PaymentStripeTerminalWrapper = (props: Props) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(false);
  const [stripeErrorCode, setStripeErrorCode] = useState(null);
  const [stripeDeclineCode, setStripeDeclineCode] = useState(null);

  const { requestSetupIntentSecret } = props;

  useEffect(() => {
    const requestSecret = async () => {
      try {
        const response = await requestSetupIntentSecret();
        setClientSecret(response.data.client_secret);
        setError(false);
        setStripeErrorCode(null);
        setStripeDeclineCode(null);
      } catch (err) {
        setError(true);
        if (err.response && err.response.data && err.response.data.code) {
          setStripeErrorCode(err.response.data.code);
        }
        if (
          err.response &&
          err.response.data &&
          err.response.data.decline_code
        ) {
          setStripeDeclineCode(err.response.data.decline_code);
        }
      }
    };
    requestSecret();
  }, [requestSetupIntentSecret]);

  const classes = useStyles();
  const { t } = useTranslation(['payment']);

  return (
    <>
      {error ? (
        <div>
          <div className={classes.centered}>
            <ErrorIcon style={{ height: 100, width: 100 }} color="secondary" />
            <Typography className={classes.message}>
              {t('forms.paymentMethod.message.error')}
            </Typography>
            {stripeErrorCode || stripeDeclineCode ? (
              <StripeErrorCode
                errorCode={stripeErrorCode}
                declineCode={stripeDeclineCode}
              />
            ) : null}
          </div>
          <div className={classes.actions}>
            {props.onCancel && (
              <Button onClick={props.onCancel}>
                {t('forms.paymentMethod.actions.close')}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <PaymentStripeTerminal
          clientSecret={clientSecret}
          onCancel={props.onCancel}
          onSuccess={props.onSuccess}
          stripeReaders={props.stripeReaders}
          isSetupIntent={props.isSetupIntent}
          setProcessing={props.setProcessing}
          companyId={props.companyId}
        />
      )}
    </>
  );
};

export default PaymentStripeTerminalWrapper;
