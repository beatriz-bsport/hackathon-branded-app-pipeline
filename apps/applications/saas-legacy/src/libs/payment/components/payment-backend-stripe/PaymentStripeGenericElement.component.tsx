import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
} from '@bsport/common/lib/master-data/payment-group';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import {
  Button,
  Checkbox,
  CircularProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Info from '@material-ui/icons/Info';

import {
  blockPendingBasket as blockPendingBasketAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
} from '#src/libs/payment/api';
import {
  StripePaymentMethodNames,
  USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
  USER_REGISTRATION_RESPONSE_QUERY_PARAM,
} from '#src/libs/payment/constants';
import { confirmStripePayment as confirmStripePaymentAction } from '#src/libs/payment/payment-module-revamped/actions';
import { saveQueryParamInLocalStorage } from '#src/libs/utils';

import CheckoutContext from '#src/pages/checkout/basket/CheckoutContext';
import PopOver from '#src/components/Popover';

type PaymentStripeGenericElementProps = {
  AcceptTermsAndConditionsComponent: React.Component;
  basketId?: string;
  basketTotalPriceCts?: number;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  children?: React.ReactNode;
  clientSecret: string;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  forceDisabled?: boolean;
  forceHideConfirmPaymentButton?: boolean;
  forceSave?: boolean;
  hasAddPaymentMethodPermission?: boolean;
  invalidatePendingBookingsIfNecessary?: () => void;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onError?: () => void;
  onSaveForLaterChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  paymentGroupId: number;
  paymentGroupMethodIdentifier: number;
  saveForLater?: boolean;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentProcessing: (processing: boolean) => void;
  termsAndConditionsAccepted: boolean;
  userDefaultEmail?: string;
  userDefaultName?: string;
};

export const PaymentStripeGenericElement = forwardRef(
  (
    {
      AcceptTermsAndConditionsComponent,
      basketId,
      basketTotalPriceCts,
      checkItemsBasket,
      children,
      clientSecret,
      createPendingBookingsIfNecessary,
      forceDisabled,
      forceHideConfirmPaymentButton,
      forceSave,
      hasAddPaymentMethodPermission = true,
      invalidatePendingBookingsIfNecessary,
      isEstablishmentBillingGroupSelected,
      loading,
      onCancel,
      onError,
      onSaveForLaterChange,
      paymentGroupId,
      paymentGroupMethodIdentifier,
      saveForLater,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      termsAndConditionsAccepted,
      userDefaultEmail,
      userDefaultName,
    }: PaymentStripeGenericElementProps,
    ref,
  ) => {
    const isCheckoutContext = useContext(CheckoutContext);
    const classes = useStyles();
    const { t } = useTranslation('invoice');
    const dispatch = useDispatch();

    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const setPaymentPageProcessing = useCallback(
      (process) => {
        if (setPaymentProcessing) setPaymentProcessing(process);
        setIsProcessing(process);
      },
      [setIsProcessing, setPaymentProcessing],
    );

    const isSubmitButtonDisabled =
      loading ||
      forceDisabled ||
      !stripe ||
      !elements ||
      !termsAndConditionsAccepted ||
      !isEstablishmentBillingGroupSelected ||
      !hasAddPaymentMethodPermission;

    // This useEffect is required in the new checkout flow, in order to disable the 'Pay Now' button
    // if needed
    useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(isSubmitButtonDisabled);
    }, [isSubmitButtonDisabled, setIsOnlinePaymentDisabled]);

    const handleSubmit = useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        setPaymentPageProcessing(true);
        setErrorMessage(undefined);
        elements?.submit();

        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
          // Stripe has not yet loaded.
          // Make sure to disable form submission until Stripe has loaded.
          return;
        }

        if (basketId) {
          /**
           * checkItemsBasket and verifyPriceBasketAPI are intentionally not moved to a Redux action because:
           * 1. They are always executed within the context of a checkout process, specifically inside an iframe widget.
           * 2. The data returned by these API calls do not need to be stored or managed within the Redux store.
           * Therefore, keeping these API calls local to this context is more appropriate and efficient.
           */
          const { data } = await verifyPriceBasketAPI(basketId);
          const basketItemsChecked = await checkItemsBasket(basketId);
          if (!basketItemsChecked) {
            setPaymentPageProcessing(false);
            return;
          }

          if (
            (!!basketTotalPriceCts || basketTotalPriceCts === 0) &&
            basketTotalPriceCts !== data
          ) {
            setPaymentPageProcessing(false);
            window.alert(t('paymentPanel.actions.basketInconsistent'));
            window.location.reload();
            return;
          }
        }

        createPendingBookingsIfNecessary?.({
          payment_group_method_identifier: paymentGroupMethodIdentifier,
        });

        saveQueryParamInLocalStorage(
          USER_REGISTRATION_RESPONSE_QUERY_PARAM,
          USER_REGISTRATION_RESPONSE_LOCAL_STORAGE_KEY,
        );

        const url = new URL(window.location.toString());
        let paymentMethodType: string | undefined;
        switch (paymentGroupMethodIdentifier) {
          case PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT:
            paymentMethodType = StripePaymentMethodNames.BANCONTACT;
            break;
          case PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL:
            paymentMethodType = StripePaymentMethodNames.IDEAL;
            break;
        }

        const params = url.searchParams;
        params.delete('redirect_status');
        params.delete('user_registration_response');
        params.set('check_payment_intent', 'true');
        params.set('get_user_registration_from_storage', 'true');
        if (paymentMethodType) {
          params.set('payment_method_type', paymentMethodType);
        }

        if (basketId) {
          // Include the current basket id in the return URL, so that the basket page keeps track
          // of it after the redirection
          params.set('basket_redirection', basketId);
        }

        dispatch(
          confirmStripePaymentAction(
            {
              saveForLater: saveForLater || forceSave,
              paymentGroupId,
              stripe,
              elements,
              clientSecret,
              return_url: url.toString(),
            },
            {
              onPaymentError: (err) => {
                if (err.type !== 'validation_error') {
                  setErrorMessage(err.message);
                }
                setPaymentPageProcessing(false);
                invalidatePendingBookingsIfNecessary?.();
                onError?.();
              },
              onPaymentSuccess: async () => {
                if (basketId) {
                  try {
                    await blockPendingBasketAPI(basketId);
                  } catch (err) {
                    console.error(err);
                  }
                }
              },
            },
          ),
        );
      },
      [
        basketId,
        basketTotalPriceCts,
        checkItemsBasket,
        clientSecret,
        createPendingBookingsIfNecessary,
        dispatch,
        elements,
        forceSave,
        invalidatePendingBookingsIfNecessary,
        onError,
        paymentGroupId,
        paymentGroupMethodIdentifier,
        saveForLater,
        setPaymentPageProcessing,
        stripe,
        t,
      ],
    );

    // This hook is required in the new checkout flow, in order to call the submit callback defined
    // in the payment method component from the parent component.
    useImperativeHandle(ref, () => ({ onPaymentConfirm: handleSubmit }), [
      handleSubmit,
    ]);

    return (
      <form onSubmit={handleSubmit}>
        {!hasAddPaymentMethodPermission ? (
          <Typography>
            {t('payment:forms.paymentMethod.actions.addPaymentMethodDenied')}
          </Typography>
        ) : (
          <>
            <div className={classes.fieldContainer}>
              <PaymentElement
                options={{
                  layout: 'tabs',
                  wallets: {
                    applePay: 'never',
                    googlePay: 'never',
                  },
                  defaultValues: {
                    billingDetails: {
                      name: userDefaultName,
                      email: userDefaultEmail,
                    },
                  },
                }}
              />
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}
            </div>
            <div className={classes.row}>
              <Checkbox
                checked={saveForLater || forceSave}
                color="primary"
                disabled={!!forceSave || isProcessing || !stripe || !elements}
                onChange={onSaveForLaterChange}
              />
              <div className={classes.leftColumn}>
                <Typography variant={isCheckoutContext ? 'body1' : 'caption'}>
                  {t('paymentPanel.actions.saveForLater')}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant={isCheckoutContext ? 'body1' : 'caption'}
                >
                  {t('paymentPanel.actions.saveForLaterAsSEPA')}
                </Typography>
              </div>
              <div className={classes.securityInformationContainer}>
                <PopOver
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  className={classes.securityInformationText}
                  title={t('paymentPanel.actions.paymentSecurityInformation')}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <Info className={classes.infoIcon} />
                </PopOver>
              </div>
            </div>
          </>
        )}
        {children}
        {!isCheckoutContext && !forceHideConfirmPaymentButton && (
          <>
            <div className={classes.conditions}>
              {AcceptTermsAndConditionsComponent}
            </div>
            <div className={classes.actionRow}>
              {isProcessing ? (
                <CircularProgress />
              ) : (
                <Button
                  color="primary"
                  disabled={isSubmitButtonDisabled}
                  type="submit"
                  variant="contained"
                >
                  {t('paymentPanel.actions.confirmPayment')}
                </Button>
              )}
              <Button disabled={isProcessing} onClick={onCancel}>
                {t('paymentPanel.actions.cancel')}
              </Button>
            </div>
          </>
        )}
      </form>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(4),
  },
  row: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  conditions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1.5),
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  securityInformationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.spacing(1),
    },
  },
  securityInformationText: {
    maxWidth: '250px',
    variant: 'tooltip',
    fontWeight: 500,
    fontSize: '10px',
    lineHeight: '14px',
  },
  infoIcon: { color: theme.palette.grey[600] },
}));

export default PaymentStripeGenericElement;
