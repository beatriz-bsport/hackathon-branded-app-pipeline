import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import {
  CircularProgress,
  Divider,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  Elements,
  ExpressCheckoutElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, type StripeElementLocale } from '@stripe/stripe-js';
import { getStripePkKey } from '#src/libs/theme/selectors';
import { getLocaleFromLanguage } from '#src/utils/language';

type StripeExpressCheckoutElementProps = {
  clientSecret: string;
  onError?: () => void;
  onLoadError?: () => void;
  onReady?: (event: {
    availablePaymentMethods?: { applePay: boolean; googlePay: boolean };
  }) => void;
  onSuccessfulPayment: () => Promise<void>;
};

const StripeExpressCheckoutElementInner: React.FC<
  StripeExpressCheckoutElementProps
> = ({ clientSecret, onError, onLoadError, onReady, onSuccessfulPayment }) => {
  const classes = useStyles();
  const { t } = useTranslation('checkout');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [wallets, setWallets] = useState<{
    applePay?: boolean;
    googlePay?: boolean;
  }>({});
  const stripe = useStripe();
  const elements = useElements();

  const [isSuccessfulPayment, setIsSuccessfulPayment] = useState(false);

  const onlyOneWallet =
    [wallets.applePay, wallets.googlePay].filter(Boolean).length === 1;

  const handleConfirm = useCallback(async () => {
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
    });

    if (error) {
      console.error('Stripe confirmation error:', error);
      onError?.();
    } else {
      onSuccessfulPayment().then(() => setIsSuccessfulPayment(true));
    }
  }, [stripe, elements, clientSecret, onError, onSuccessfulPayment]);

  return (
    <>
      <Typography className={classes.title} variant="h6">
        {t('myBasket.expressCheckoutTitle')}
      </Typography>
      {!isSuccessfulPayment ? (
        <div
          style={{ maxWidth: onlyOneWallet && !isMobile ? '300px' : '100%' }}
        >
          <ExpressCheckoutElement
            onConfirm={handleConfirm}
            onLoadError={onLoadError}
            onReady={(event) => {
              setWallets(event.availablePaymentMethods ?? {});
              onReady?.(event);
            }}
            options={{
              paymentMethods: { applePay: 'always', googlePay: 'always' },
              paymentMethodOrder: ['applePay', 'googlePay'],
            }}
          />
        </div>
      ) : (
        <CircularProgress />
      )}
      <Divider className={classes.divider} />
    </>
  );
};

const StripeExpressCheckoutElement: React.FC<
  StripeExpressCheckoutElementProps
> = (props) => {
  const stripePromise = loadStripe(getStripePkKey());

  const { language } = i18n;
  const elementLocale = getLocaleFromLanguage(language);

  return (
    <Elements
      options={{
        clientSecret: props.clientSecret,
        locale: (elementLocale?.replace('_', '-') ||
          language) as StripeElementLocale,
      }}
      stripe={stripePromise}
    >
      <StripeExpressCheckoutElementInner {...props} />
    </Elements>
  );
};

const useStyles = makeStyles((theme) => ({
  title: { marginBottom: theme.spacing(1) },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export default StripeExpressCheckoutElement;
