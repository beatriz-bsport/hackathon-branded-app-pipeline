import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
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
import {
  loadStripe,
  type StripeElementLocale,
  StripeExpressCheckoutElementClickEvent,
} from '@stripe/stripe-js';
import { getStripePkKey } from '#src/libs/theme/selectors';
import { getLocaleFromLanguage } from '#src/utils/language';

type StripeExpressCheckoutElementProps = {
  clientSecret: string;
  disabled?: boolean;
  onError?: () => void;
  onLoadError?: () => void;
  onReady?: (event: {
    availablePaymentMethods?: { applePay: boolean; googlePay: boolean };
  }) => void;
  onSuccessfulPayment: () => Promise<void>;
};

const StripeExpressCheckoutElementInner: React.FC<
  StripeExpressCheckoutElementProps
> = ({
  clientSecret,
  disabled,
  onError,
  onLoadError,
  onReady,
  onSuccessfulPayment,
}) => {
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

  const handleClick = useCallback(
    (e: StripeExpressCheckoutElementClickEvent) => {
      // The ExpressCheckoutElement does not natively support a disabled state. (as of SDK v3.7.0 from 2025-05)
      // The user can still navigate through Tab key and press Enter/Space to trigger the click event as it's an iframe
      // inside a shadow DOM, so we need to handle the disabled state manually here.
      // This ensures that if the component is disabled,the promise is rejected and no payment sheet is opened
      // For non-native browsers, the modal may still open, but the user won't be able to proceed with the payment
      if (disabled) e.reject();
    },
    [disabled],
  );

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
          aria-disabled={disabled || undefined}
          className={clsx(classes.checkoutContainer, {
            [classes.singleWallet]: onlyOneWallet && !isMobile,
            [classes.disabled]: disabled,
          })}
          tabIndex={disabled ? -1 : undefined}
        >
          <ExpressCheckoutElement
            onClick={handleClick}
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
  checkoutContainer: {
    width: '100%',
  },
  singleWallet: {
    maxWidth: 300,
  },
  disabled: {
    pointerEvents: 'none',
    cursor: 'not-allowed',
    opacity: 0.5,
    userSelect: 'none',
  },
}));

export default StripeExpressCheckoutElement;
