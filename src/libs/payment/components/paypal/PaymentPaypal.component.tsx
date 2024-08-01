import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';

import CircularProgress from '#src/components/css-only/CircularProgress';
import type { AxiosError } from 'axios';
import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { PAYMENT_EXECUTION_ERROR_CODES } from '@bsport/common/lib/master-data/error-codes/payment';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
// @ts-expect-error
import i18n from '#src/i18n/index';
import { getLocaleFromLanguage } from '#src/utils/language';
import Config from '#src/config';
import { isErrorWithCustomCode } from '#src/libs/utils';
import {
  createPaymentAttempt as createPaymentAttemptAction,
  executePaymentAttempt as executePaymentAttemptAction,
} from '#src/libs/payment/actions';
import { CheckoutContext } from '#src/pages/checkout/basket/CheckoutContext';
import UseInternalAccountForm from '#src/libs/payment/components/UseInternalAccountForm.component';
import { getCurrencyCode } from '#src/libs/theme/selectors';
import PayPalPaymentButton from './PayPalPaymentButton.component';
import { PaymentAttemptMinimal } from '#src/libs/payment/types';

type Props = {
  acceptTermsAndConditionsElement?: React.ReactElement;
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  applyBalanceToInvoice?: () => void;
  basketId: string;
  children?: React.ReactNode;
  clientSecret: string;
  clientSecretLoading?: boolean;
  createPaymentAttempt: (
    paymentGroupId: number,
    fromApp: boolean,
    basketId?: string,
  ) => Promise<PaymentAttemptMinimal>;
  creditAccountBalance?: number | null;
  customClasses?: { [className: string]: string };
  executePaymentAttempt: (
    paymentGroupId: number,
    fromApp: boolean,
    basketId?: string,
    options?: {
      onError: (error: AxiosError) => void;
      onSuccess: () => void;
    },
  ) => Promise<void>;
  forceButtonDisplay?: boolean;
  forceDisabled?: boolean;
  forceHideButton?: boolean;
  fromApp?: boolean;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  onCancel?: () => void;
  onError?: () => void;
  onSuccess: (callback: () => void) => void;
  paymentGroupId: number;
  paymentProcessing?: boolean;
  setPaymentProcessing: (processing: boolean) => void;
  snackbarErrorMsg?: (message: string) => void;
  termsAndConditionsAccepted: boolean;
  useInternalAccount?: (amount: number) => void;
  basketPriceCts?: number;
};

const PaymentPaypal: React.FC<Props> = ({
  acceptTermsAndConditionsElement,
  allowConsumerToUseInternalAccount,
  applyBalanceLoading,
  applyBalanceToInvoice,
  basketId,
  children,
  basketPriceCts,
  clientSecret,
  clientSecretLoading,
  creditAccountBalance,
  customClasses,
  executePaymentAttempt,
  forceButtonDisplay,
  forceDisabled,
  forceHideButton,
  fromApp,
  isEstablishmentBillingGroupSelected,
  loading,
  termsAndConditionsAccepted,
  onCancel,
  onError,
  onSuccess,
  createPaymentAttempt,
  paymentGroupId,
  paymentProcessing,
  setPaymentProcessing,
  snackbarErrorMsg,
  useInternalAccount,
}: Props) => {
  const isNewCheckoutFlow = React.useContext(CheckoutContext);
  const classes = useStyles();

  const { t } = useTranslation('invoice');

  const createOrder = React.useCallback(async (): Promise<string> => {
    const response = await createPaymentAttempt(
      paymentGroupId,
      fromApp,
      basketId,
    );
    // Basket price might have changed since the customer got to the checkout page
    // We need to make sure that the price the customer is trying to pay matches the one we'll be sending to PayPal.
    // Otherwise, we force the customer to reload the page.
    if (Math.round(response.amount * 100) !== basketPriceCts) {
      const url = new URL(window.location.href);
      url.searchParams.append('paypalError', 'basketInconsistent');
      window.location.href = url.toString();
      return;
    }
    return response.id;
  }, [basketId, fromApp, paymentGroupId, basketPriceCts, createPaymentAttempt]);

  const onApprove = React.useCallback((): Promise<void> => {
    setPaymentProcessing(true);

    return executePaymentAttempt(paymentGroupId, fromApp, basketId, {
      onError: (error: AxiosError) => {
        setPaymentProcessing(false);
        if (onError) onError();

        if (
          isErrorWithCustomCode(error) &&
          error.response.data &&
          snackbarErrorMsg
        ) {
          // Multiple exceptions could be returned in the response
          const error_data = Array.isArray(error.response.data)
            ? error.response.data
            : [error.response.data];

          error_data.forEach((exc: { error_code: number }) => {
            const { error_code } = exc;

            if (ALL_ERROR_CODES.includes(error_code)) {
              snackbarErrorMsg(`canNotBuyErrorCode.${error_code}`);
            } else if (PAYMENT_EXECUTION_ERROR_CODES.includes(error_code)) {
              snackbarErrorMsg(`canNotExecutePaymentAttempt.${error_code}`);
            } else {
              snackbarErrorMsg('canNotExecutePaymentAttempt.generic');
            }
          });
        }
      },
      onSuccess: () => {
        onSuccess(() => setPaymentProcessing(false));
      },
    });
  }, [
    basketId,
    fromApp,
    paymentGroupId,
    onSuccess,
    onError,
    snackbarErrorMsg,
    setPaymentProcessing,
    executePaymentAttempt,
  ]);

  const onPayPalError = React.useCallback(() => {
    if (onError) onError();
    if (snackbarErrorMsg)
      snackbarErrorMsg('canNotExecutePaymentAttempt.generic');
  }, [onError, snackbarErrorMsg]);

  const onPayPalCancel = React.useCallback(() => {
    if (snackbarErrorMsg) snackbarErrorMsg('cancelPayPalPaymentAttempt');
  }, [snackbarErrorMsg]);

  const isSubmitButtonDisabled =
    paymentProcessing ||
    forceDisabled ||
    loading ||
    !termsAndConditionsAccepted ||
    !isEstablishmentBillingGroupSelected;

  const { language } = i18n;
  const buttonLocale = getLocaleFromLanguage(language);

  return (
    <>
      {paymentGroupId && (
        <>
          {allowConsumerToUseInternalAccount && !!creditAccountBalance && (
            <>
              <div className={classes.paddingTop1} />
              <UseInternalAccountForm
                creditAccountBalance={creditAccountBalance}
                loading={loading || applyBalanceLoading}
                onBasketSubmit={useInternalAccount}
                onInvoiceSubmit={applyBalanceToInvoice}
              />
            </>
          )}
          {children ?? null}
          {(!isNewCheckoutFlow || forceButtonDisplay) && !forceHideButton && (
            <>
              {acceptTermsAndConditionsElement && (
                <div
                  className={classNames(
                    classes.conditions,
                    customClasses?.conditions,
                  )}
                >
                  {acceptTermsAndConditionsElement}
                </div>
              )}
              <div
                className={classNames(
                  classes.actionRow,
                  customClasses?.actionRow,
                )}
              >
                {clientSecretLoading ? (
                  <CircularProgress />
                ) : (
                  <div className={classes.paypalButton}>
                    <PayPalScriptProvider
                      options={{
                        clientId: Config.REACT_APP_PAYPAL_CLIENT_ID,
                        merchantId: clientSecret,
                        components: 'buttons,funding-eligibility,marks',
                        currency: getCurrencyCode().toUpperCase(),
                        integrationDate: '2020-07-01',
                        debug: false,
                        commit: true,
                        intent: 'capture',
                        dataPartnerAttributionId:
                          Config.REACT_APP_PAYPAL_PARTNER_ATTRIBUTION_ID,
                        ...(buttonLocale ? { locale: buttonLocale } : {}),
                      }}
                    >
                      <PayPalPaymentButton
                        createOrder={createOrder}
                        isDisabled={isSubmitButtonDisabled}
                        onApprove={onApprove}
                        onCancel={onPayPalCancel}
                        onError={onPayPalError}
                      />
                    </PayPalScriptProvider>
                  </div>
                )}
                <Button disabled={loading} onClick={onCancel}>
                  {t('paymentPanel.actions.cancel')}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paddingTop1: {
    paddingTop: theme.spacing(1),
  },
  paypalButton: {
    width: theme.spacing(25),
    height: theme.spacing(5),
  },
  actionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'alignItems',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
  conditions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'alignItems',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1.5),
  },
}));

const mapDispatchToProps = {
  createPaymentAttempt: createPaymentAttemptAction,
  executePaymentAttempt: executePaymentAttemptAction,
};

export default connect(() => {}, mapDispatchToProps)(React.memo(PaymentPaypal));
