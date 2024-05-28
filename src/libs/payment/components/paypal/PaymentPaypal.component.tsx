import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import type { AxiosResponse } from 'axios';
import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { PAYMENT_EXECUTION_ERROR_CODES } from '@bsport/common/lib/master-data/error-codes/payment';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Config from '#src/config';
import { isErrorWithCustomCode } from '#libs/utils';
import {
  createPaymentAttempt,
  createPaymentAttemptWebview,
  executePaymentAttempt,
  executePaymentAttemptWebview,
} from '#libs/payment/api';

import { CheckoutContext } from '#pages/checkout/basket/CheckoutContext';
import UseInternalAccountForm from '#libs/payment/components/UseInternalAccountForm.component';
import { getCurrencyCode } from '#src/libs/theme/selectors';
import PayPalPaymentButton from './PayPalPaymentButton.component';

type Props = {
  acceptTermsAndConditionsElement?: React.ReactElement;
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  applyBalanceToInvoice?: () => void;
  basketId: string;
  children?: React.ReactNode;
  clientSecret: string;
  creditAccountBalance?: number | null;
  customClasses?: { [className: string]: string };
  forceButtonDisplay?: boolean;
  forceDisabled?: boolean;
  forceHideButton?: boolean;
  fromApp?: boolean;
  isEstablishmentBillingGroupSelected?: boolean;
  loading?: boolean;
  locale?: string;
  onCancel?: () => void;
  onError?: () => void;
  onSuccess: (callback: () => void) => void;
  paymentGroupId: number;
  paymentProcessing?: boolean;
  setPaymentProcessing: (processing: boolean) => void;
  snackbarErrorMsg?: (message: string) => void;
  termsAndConditionsAccepted: boolean;
  useInternalAccount?: (amount: number) => void;
};

const PaymentPaypal: React.FC<Props> = ({
  acceptTermsAndConditionsElement,
  allowConsumerToUseInternalAccount,
  applyBalanceLoading,
  applyBalanceToInvoice,
  basketId,
  children,
  clientSecret,
  creditAccountBalance,
  customClasses,
  forceButtonDisplay,
  forceDisabled,
  forceHideButton,
  fromApp,
  isEstablishmentBillingGroupSelected,
  loading,
  locale,
  termsAndConditionsAccepted,
  onCancel,
  onError,
  onSuccess,
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
    // Allows to authenticate the user through the basket uuid if used in webview
    const createPaymentAttemptMethod: ({
      paymentGroupId,
      basketId,
    }: {
      paymentGroupId: number;
      basketId?: string;
    }) => Promise<AxiosResponse> = fromApp
      ? createPaymentAttemptWebview
      : createPaymentAttempt;

    const response = await createPaymentAttemptMethod({
      paymentGroupId,
      ...(fromApp ? { basketId } : {}),
    });

    return response.data.payment_attempt_id;
  }, [basketId, fromApp, paymentGroupId]);

  const onApprove = React.useCallback(async (): Promise<void> => {
    setPaymentProcessing(true);
    // Allows to authenticate the user through the basket uuid if used in webview
    const executePaymentAttemptMethod: ({
      paymentGroupId,
      basketId,
    }: {
      paymentGroupId: number;
      basketId?: string;
    }) => Promise<AxiosResponse> = fromApp
      ? executePaymentAttemptWebview
      : executePaymentAttempt;

    try {
      await executePaymentAttemptMethod({
        paymentGroupId,
        ...(fromApp ? { basketId } : {}),
      });
      onSuccess(() => setPaymentProcessing(false));
    } catch (error) {
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
    }
  }, [
    basketId,
    fromApp,
    paymentGroupId,
    onSuccess,
    onError,
    snackbarErrorMsg,
    setPaymentProcessing,
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
                    ...(locale ? { locale } : {}),
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
              <div
                className={classNames(
                  classes.actionRow,
                  customClasses?.actionRow,
                )}
              >
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
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
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

export default React.memo(PaymentPaypal);
