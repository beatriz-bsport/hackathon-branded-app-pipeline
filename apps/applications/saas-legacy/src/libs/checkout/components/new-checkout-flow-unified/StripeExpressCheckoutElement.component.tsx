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
import { getCurrencyCode, getStripePkKey } from '#src/libs/theme/selectors';
import { getLocaleFromLanguage } from '#src/utils/language';
import { useBasketPaymentContext } from './BasketPaymentContext';
import type { StripePaymentElementConfig } from '#src/libs/company/types';
import { verifyPriceBasket as verifyPriceBasketAPI } from '#src/libs/payment/api';

type StripeExpressCheckoutElementProps = {
  allowedWallets?: { applePay: boolean; googlePay: boolean };
  amountToPayCts: number;
  basketId: string;
  basketTotalPriceCts: number;
  checkBasketItems: (basketId: string) => Promise<boolean>;
  clientSecret: string;
  disabled?: boolean;
  onError?: () => void;
  onLoadError?: () => void;
  onReady?: (event: {
    availablePaymentMethods?: { applePay: boolean; googlePay: boolean };
  }) => void;
  onSuccessfulPayment: () => Promise<void>;
  stripePaymentElementConfig: StripePaymentElementConfig;
};

type StripeExpressCheckoutElementInnerProps = Omit<
  StripeExpressCheckoutElementProps,
  'amountToPayCts' | 'stripePaymentElementConfig'
> & {
  basketTotalPriceCts: number;
  paymentMethods: Record<string, 'always' | 'never'>;
  paymentMethodOrder: string[];
};

const StripeExpressCheckoutElementInner: React.FC<
  StripeExpressCheckoutElementInnerProps
> = ({
  basketId,
  basketTotalPriceCts,
  checkBasketItems,
  clientSecret,
  disabled,
  onError,
  onLoadError,
  onReady,
  onSuccessfulPayment,
  paymentMethods,
  paymentMethodOrder,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['checkout', 'invoice']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [wallets, setWallets] = useState<{
    applePay?: boolean;
    googlePay?: boolean;
  }>({});
  const stripe = useStripe();
  const elements = useElements();

  const { isExpressPayLoading, setIsExpressPayLoading } =
    useBasketPaymentContext();

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
      if (disabled) {
        setIsExpressPayLoading(false);
        e.reject();
      } else {
        setIsExpressPayLoading(true);
        e.resolve();
      }
    },
    [disabled, setIsExpressPayLoading],
  );

  const handleConfirm = useCallback(async () => {
    if (!stripe || !elements) return;

    setIsExpressPayLoading(true);

    // Validate basket before confirming payment
    // This ensures the basket amount hasn't changed in another tab
    try {
      const { data } = await verifyPriceBasketAPI(basketId);
      const basketItemsChecked = await checkBasketItems(basketId);

      if (!basketItemsChecked) {
        setIsExpressPayLoading(false);
        onError?.();
        return;
      }

      if (
        (!!basketTotalPriceCts || basketTotalPriceCts === 0) &&
        basketTotalPriceCts !== data
      ) {
        setIsExpressPayLoading(false);
        window.alert(
          t('paymentPanel.actions.basketInconsistent', { ns: 'invoice' }),
        );
        window.location.reload();
        return;
      }
    } catch (err) {
      console.error('Basket validation error:', err);
      setIsExpressPayLoading(false);
      onError?.();
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
      confirmParams: { return_url: window.location.href },
    });

    if (error) {
      console.error('Stripe confirmation error:', error);
      setIsExpressPayLoading(false);
      onError?.();
      return;
    }

    try {
      await onSuccessfulPayment();
      setIsSuccessfulPayment(true);
    } catch (err) {
      console.error('Express checkout post-confirm failure:', err);
      setIsExpressPayLoading(false);
      onError?.();
    }
  }, [
    stripe,
    elements,
    setIsExpressPayLoading,
    basketTotalPriceCts,
    basketId,
    checkBasketItems,
    clientSecret,
    onError,
    onSuccessfulPayment,
    t,
  ]);

  const handleCancel = useCallback(() => {
    setIsExpressPayLoading(false);
  }, [setIsExpressPayLoading]);

  const handleLoadError = useCallback(() => {
    setIsExpressPayLoading(false);
    onLoadError?.();
  }, [setIsExpressPayLoading, onLoadError]);

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
            [classes.disabled]: disabled || isExpressPayLoading,
          })}
          tabIndex={disabled ? -1 : undefined}
        >
          <ExpressCheckoutElement
            onCancel={handleCancel}
            onClick={handleClick}
            onConfirm={handleConfirm}
            onLoadError={handleLoadError}
            onReady={(event) => {
              setWallets(event.availablePaymentMethods ?? {});
              onReady?.(event);
            }}
            options={{
              paymentMethods,
              paymentMethodOrder,
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
  const {
    allowedWallets = { applePay: false, googlePay: false },
    amountToPayCts,
    basketId,
    basketTotalPriceCts,
    checkBasketItems,
    clientSecret,
    disabled,
    onError,
    onLoadError,
    onReady,
    onSuccessfulPayment,
    stripePaymentElementConfig,
  } = props;

  const stripePromise = loadStripe(getStripePkKey());
  const currency = getCurrencyCode();

  const { language } = i18n;
  const elementLocale = getLocaleFromLanguage(language);

  const paymentMethods: Record<string, 'always' | 'never'> = {};
  const paymentMethodOrder: string[] = [];
  if (allowedWallets.applePay) {
    paymentMethods.applePay = 'always';
    paymentMethodOrder.push('applePay');
  } else {
    paymentMethods.applePay = 'never';
  }
  if (allowedWallets.googlePay) {
    paymentMethods.googlePay = 'always';
    paymentMethodOrder.push('googlePay');
  } else {
    paymentMethods.googlePay = 'never';
  }

  return (
    <Elements
      options={{
        mode: 'payment',
        amount: amountToPayCts,
        currency,
        ...(!stripePaymentElementConfig.isDefaultForRegion &&
        stripePaymentElementConfig.stripeId
          ? { onBehalfOf: stripePaymentElementConfig.stripeId }
          : {}),
        locale: (elementLocale?.replace('_', '-') ||
          language) as StripeElementLocale,
        // MANDATORY: For a US account, paying with Apple Pay or Google Pay will get this error:
        // "Payment details were collected through Stripe Elements using automatic payment methods and cannot be confirmed
        // through the API configured with payment_method_types."
        // When creating the PaymentIntent in the backend, we use payment_method_types depending on the account country
        // and a US account does not consider Apple Pay or Google Pay as a "card" payment method but as a wallet.
        // Setting it here overrides all PaymentIntent settings and makes it work.
        // See `paymentMethodTypes` in: https://docs.stripe.com/js/elements_object/create_without_intent#stripe_elements_no_intent-options
        paymentMethodTypes: ['card'],
      }}
      stripe={stripePromise}
    >
      <StripeExpressCheckoutElementInner
        {...{
          basketId,
          basketTotalPriceCts,
          checkBasketItems,
          clientSecret,
          disabled,
          onError,
          onLoadError,
          onReady,
          onSuccessfulPayment,
          paymentMethodOrder,
          paymentMethods,
        }}
      />
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
