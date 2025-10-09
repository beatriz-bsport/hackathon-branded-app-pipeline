import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT } from '@bsport/common/lib/master-data/payment-group';

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

import { usePaymentSubmit } from './hooks/usePaymentSubmit';

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
  onCancel?: () => void;
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
      if (!isCheckoutContext && !forceHideConfirmPaymentButton)
        setIsOnlinePaymentDisabled?.(isSubmitButtonDisabled);
    }, [
      forceHideConfirmPaymentButton,
      isCheckoutContext,
      isSubmitButtonDisabled,
      setIsOnlinePaymentDisabled,
    ]);

    const { handleSubmit } = usePaymentSubmit({
      basketId,
      basketTotalPriceCts,
      checkItemsBasket,
      clientSecret,
      createPendingBookingsIfNecessary,
      elements,
      forceSave,
      invalidatePendingBookingsIfNecessary,
      onError: () => {
        invalidatePendingBookingsIfNecessary?.();
        onError?.();
      },
      paymentGroupId,
      saveForLater,
      setPaymentPageProcessing: (process) => {
        setPaymentPageProcessing(process);
        if (!process) {
          setErrorMessage(undefined);
        }
      },
      setError: (err) => {
        if (err && err.type !== 'validation_error') {
          setErrorMessage(err.message);
        }
      },
      stripe,
      paymentMethodData: {
        payment_group_method_identifier: paymentGroupMethodIdentifier,
        return_url: window.location.toString(), // Will be updated by the hook
      },
    });

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
            {/* Twint is the only stripe payment method that does not support saving, so the checkbox does not appear in this case. No need for additional complexity */}
            {paymentGroupMethodIdentifier !==
              PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT && (
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
            )}
          </>
        )}
        {children}
        {!isCheckoutContext && !forceHideConfirmPaymentButton && (
          <>
            <div className={clsx(classes.flexRow, classes.conditions)}>
              {AcceptTermsAndConditionsComponent}
            </div>
            <div
              className={clsx(
                classes.flexRow,
                onCancel ? classes.actionRow : classes.actionRowCentered,
              )}
            >
              {isProcessing ? (
                <CircularProgress />
              ) : (
                <>
                  <div
                    className={clsx(
                      classes.submitButtonBase,
                      onCancel
                        ? classes.submitButton
                        : classes.submitButtonFullWidth,
                    )}
                  >
                    <Button
                      fullWidth
                      color="primary"
                      disabled={isSubmitButtonDisabled}
                      type="submit"
                      variant="contained"
                    >
                      {t('paymentPanel.actions.confirmPayment')}
                    </Button>
                  </div>
                  {onCancel ? (
                    <Button disabled={isProcessing} onClick={onCancel}>
                      {t('paymentPanel.actions.cancel')}
                    </Button>
                  ) : (
                    <div />
                  )}
                </>
              )}
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
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  conditions: {
    justifyContent: 'space-between',
    marginLeft: theme.spacing(1.5),
  },
  actionRow: {
    justifyContent: 'space-between',
  },
  actionRowCentered: {
    justifyContent: 'center',
  },
  submitButtonBase: {
    height: theme.spacing(5),
  },
  submitButton: {
    width: theme.spacing(25),
  },
  submitButtonFullWidth: {
    width: '100%',
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
