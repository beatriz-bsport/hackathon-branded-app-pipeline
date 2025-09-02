import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

import { PaymentMethodCardSelector } from '#src/libs/payment/components/PaymentMethodCardSelector.component';
import InstalmentPaymentSelector from '#src/libs/instalment-payment-configuration/components/InstalmentPaymentSelector.component';
import CircularProgress from '@material-ui/core/CircularProgress';
import PaymentStripeRevamped, {
  PaymentStripeRevampedHandle,
} from '#src/libs/payment/payment-module-revamped/payment-backend-stripe/PaymentStripeRevamped.component';
import CheckoutBillingGroupSelector from '#src/libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';
import PaymentPaypal, {
  PaymentPaypalHandle,
} from '#src/libs/payment/components/paypal/PaymentPaypal.component';
import AcceptTermsAndConditions from '#src/libs/payment/components/AcceptTermsAndConditions.component';
import StripeExpressCheckoutElement from '#src/libs/payment/components/payment-backend-stripe/StripeExpressCheckoutElement';

import { useBasketPaymentStatusTracker } from './hooks/useBasketPaymentStatusTracker';
import { useBasketPaymentLocalState } from './hooks/useBasketPaymentLocalState';
import { useBasket } from './hooks/useBasket';
import { useCompanyPaymentSettings } from './hooks/useCompanyPaymentSettings';
import { useMember } from './hooks/useMember';
import { usePayment } from './hooks/usePayment';
import { usePaymentMethod } from './hooks/usePaymentMethod';
import { useMemberPaymentMethodListProvider } from '#src/libs/payment/payment-module-revamped/hooks/useMemberPaymentMethodListProvider';

import { shouldBlockDigitalWallets } from '#src/libs/payment/utils';

import { TermsAndConditionType } from '#src/libs/payment/types';

import {
  PAYMENT_ENGINE_PAYPAL,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_APPLE_PAY,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GOOGLE_PAY,
  PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET,
  PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT,
  PAYMENT_INTENT_STATUS_CANCELED,
  PAYMENT_INTENT_STATUS_DISPUTED,
  PAYMENT_INTENT_STATUS_PLANNED,
  PAYMENT_INTENT_STATUS_PROCESSING,
  PAYMENT_INTENT_STATUS_SUCCESS,
} from '@bsport/common/lib/master-data/payment-group';

type Props = {
  basketId: string;
  companyId: number;
  hideConfirmPaymentButton?: boolean;
  payerContext: {
    memberId: number;
    fromApp?: boolean;
    termsAndConditionsAccepted?: boolean;
  };
  setTermsAndConditionsAccepted?: (termsAndConditionsAccepted: boolean) => void;
  showAcceptTermsAndConditions?: boolean;
  onCancelPaymentBeforeConfirming?: () => void;
  onConfirmPaymentError?: () => void;
  onConfirmPaymentSuccess: (callback?: () => void) => void;
  ref?: React.Ref<any>;
};

export const OnlinePaymentBasket: React.FC<Props> = forwardRef(
  (
    {
      basketId,
      companyId,
      hideConfirmPaymentButton,
      payerContext: { memberId, fromApp, termsAndConditionsAccepted },
      setTermsAndConditionsAccepted,
      showAcceptTermsAndConditions,
      onCancelPaymentBeforeConfirming,
      onConfirmPaymentError,
      onConfirmPaymentSuccess,
    },
    ref,
  ) => {
    const classes = useStyles();
    const { t } = useTranslation(['invoice']);

    const paymentStripeRef = React.useRef<PaymentStripeRevampedHandle>(null);
    const paymentPaypalRef = React.useRef<PaymentPaypalHandle>(null);

    const {
      basketTotalPriceCts,
      basketTotalPricePrepaidLinesCts,
      isBasketLoading,
      isCurrentBasketProcessing,
      submitUnpaidBasket,
      checkBasketItems,
      handleFetchBasket,
    } = useBasket(basketId, companyId, memberId);

    const {
      companyTheme,
      establishmentBillingGroups,
      generalTermsAndConditions,
      isCardBillingDetailsMandatory,
      isCompanyThemeLoading,
      isConsumerAllowedToUseInternalAccount,
      isMultiLocalizationEnabled,
      paymentMethodAvailableBasket,
      handleFetchCompanyThemeWithEstablishmentBillingGroups,
    } = useCompanyPaymentSettings(companyId);

    const {
      creditAccount: { creditAccountBalance },
      member: { sepaDefaultEmail, sepaDefaultName },
    } = useMember(basketId, memberId);

    const {
      clientSecret,
      handleFetchPaymentGroupStatus,
      handleSetPaymentProcessing,
      instalmentPaymentConfigurations,
      instalmentPaymentSelectedId,
      isClientSecretLoading,
      paymentGroupId,
      paymentGroupPriceCts,
      selectInstalmentPayment,
      useInternalAccount,
      handleFetchInstalmentPaymentByBasket,
      getClientSecret,
      createPendingBookingsIfNecessary,
      invalidatePendingBookingsIfNecessary,
    } = usePayment(basketId, companyId, memberId);

    const { detachPaymentMethod, isDetachPaymentMethodLoading } =
      usePaymentMethod(basketId, companyId, memberId);

    const {
      selectedPaymentEngine,
      selectedEstablishmentBillingGroup,
      isEstablishmentBillingGroupSelected,
      setIsEstablishmentBillingGroupSelected,
      setSelectedEstablishmentBillingGroup,
      areTermsAndConditionsAccepted,
      setAreTermsAndConditionsAccepted,
      setIsOnlinePaymentDisabled,
      isOnlinePaymentDisabled,
      setSelectedPaymentEngine,
    } = useBasketPaymentLocalState();

    const { isPaymentProcessing, isSettingUpPayment } =
      useBasketPaymentStatusTracker(basketId, memberId);

    const { handleFetchMemberPaymentMethodList } =
      useMemberPaymentMethodListProvider({ memberId });

    const [paymentMethodSelected, setPaymentMethodSelected] = useState(
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    );

    const [
      availableExpressCheckoutMethods,
      setAvailableExpressCheckoutMethods,
    ] = useState<boolean | null>(null);

    const isOnlinePaymentLoading =
      !basketTotalPriceCts || !clientSecret || isSettingUpPayment;

    const isTotalPriceNull = !(
      (basketTotalPriceCts || 0) - (basketTotalPricePrepaidLinesCts || 0)
    );

    const showStripeExpressCheckout = useMemo(
      () =>
        selectedPaymentEngine === PAYMENT_ENGINE_STRIPE &&
        !!clientSecret &&
        !shouldBlockDigitalWallets() &&
        (paymentMethodAvailableBasket?.includes(
          PAYMENT_GROUP_METHOD_IDENTIFIER_APPLE_PAY,
        ) ||
          paymentMethodAvailableBasket?.includes(
            PAYMENT_GROUP_METHOD_IDENTIFIER_GOOGLE_PAY,
          )) &&
        availableExpressCheckoutMethods !== false,
      [
        availableExpressCheckoutMethods,
        clientSecret,
        paymentMethodAvailableBasket,
        selectedPaymentEngine,
      ],
    );

    const handleSelectPaymentMethod = useCallback(
      (paymentMethod: number) => {
        if (paymentMethod === PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET) {
          setSelectedPaymentEngine(PAYMENT_ENGINE_PAYPAL);
        } else {
          setSelectedPaymentEngine(PAYMENT_ENGINE_STRIPE);
        }
        setPaymentMethodSelected(paymentMethod);
      },
      [setSelectedPaymentEngine],
    );

    const handleAcceptTermsandConditions = useCallback(
      (accepted: boolean) => {
        setAreTermsAndConditionsAccepted(accepted);
        setTermsAndConditionsAccepted?.(accepted);
      },
      [setAreTermsAndConditionsAccepted, setTermsAndConditionsAccepted],
    );

    /**
     * Checks if the backend has processed the payment after receiving a webhook event.
     *
     * @callback
     * @param {PaymentGroupStatus} paymentIntentStatus - The status of the payment intent.
     * @returns {boolean} Returns true if the payment intent status is either 'success', 'canceled', 'processing', 'planned', or 'disputed'.
     */
    const hasBackendProcessedPayment = useCallback(
      (paymentIntentStatus: number) =>
        [
          PAYMENT_INTENT_STATUS_SUCCESS,
          PAYMENT_INTENT_STATUS_CANCELED,
          PAYMENT_INTENT_STATUS_PROCESSING,
          PAYMENT_INTENT_STATUS_PLANNED,
          PAYMENT_INTENT_STATUS_DISPUTED,
        ].includes(paymentIntentStatus),
      [],
    );

    const onSuccessfulPayment = useCallback(async (): Promise<void> => {
      // wrap retry fetchPaymentGroupStatus
      return new Promise((resolve) => {
        !!paymentGroupId &&
          handleFetchPaymentGroupStatus({
            paymentGroupId,
            options: {
              onSuccess: (paymentIntentStatus) => {
                if (hasBackendProcessedPayment(paymentIntentStatus as number)) {
                  setTimeout(() => {
                    onConfirmPaymentSuccess();
                    resolve();
                  }, 2000);
                } else {
                  // retry
                  setTimeout(() => {
                    onSuccessfulPayment().then(resolve);
                  }, 1000);
                }
              },
            },
          });
      });
    }, [
      onConfirmPaymentSuccess,
      hasBackendProcessedPayment,
      paymentGroupId,
      handleFetchPaymentGroupStatus,
    ]);

    const handleExpressCheckoutError = useCallback(() => {
      invalidatePendingBookingsIfNecessary();
      onConfirmPaymentError?.();
    }, [invalidatePendingBookingsIfNecessary, onConfirmPaymentError]);

    const handleExpressCheckoutReady = useCallback(
      (event: {
        availablePaymentMethods?: { applePay: boolean; googlePay: boolean };
      }) => {
        const hasAvailableMethods =
          event.availablePaymentMethods &&
          (event.availablePaymentMethods.applePay ||
            event.availablePaymentMethods.googlePay);
        setAvailableExpressCheckoutMethods(!!hasAvailableMethods);
      },
      [],
    );

    useEffect(() => {
      handleFetchCompanyThemeWithEstablishmentBillingGroups();
      handleFetchBasket();
      handleFetchInstalmentPaymentByBasket();
      handleFetchMemberPaymentMethodList();
    }, []);

    useEffect(() => {
      getClientSecret(selectedPaymentEngine);
    }, [getClientSecret, selectedPaymentEngine]);

    // This useEffect is mandatory in the new checkout flow, since if this condition is not
    // fullfilled no Stripe PaymentMethodForm component is mounted yet and so we don't want the
    // Pay button to be active
    useEffect(() => {
      setIsOnlinePaymentDisabled(isOnlinePaymentLoading);
    }, [isOnlinePaymentLoading, setIsOnlinePaymentDisabled]);

    useImperativeHandle(
      ref,
      () => {
        return {
          paymentMethodAvailableBasket,
          onPaymentConfirm: (event: React.FormEvent<HTMLFormElement>) => {
            if (isTotalPriceNull) {
              submitUnpaidBasket();
            } else {
              paymentStripeRef.current?.onPaymentConfirm(event);
            }
          },
          onPayLaterSubmit: submitUnpaidBasket,
          onPayPalCreateOrder: paymentPaypalRef.current?.onPayPalCreateOrder,
          onPayPalApprove: paymentPaypalRef.current?.onPayPalApprove,
          onPayPalCancel: paymentPaypalRef.current?.onPayPalCancel,
          onPayPalError: paymentPaypalRef.current?.onPayPalError,
          paymentEngine: selectedPaymentEngine,
          paymentMethodSelected,
          isOnlinePaymentDisabled: isOnlinePaymentDisabled,
          isEstablishmentBillingGroupSelected:
            isEstablishmentBillingGroupSelected,
          selectedEstablishmentBillingGroup: selectedEstablishmentBillingGroup,
        };
      },
      [
        isEstablishmentBillingGroupSelected,
        isOnlinePaymentDisabled,
        isTotalPriceNull,
        paymentMethodAvailableBasket,
        paymentMethodSelected,
        selectedEstablishmentBillingGroup,
        selectedPaymentEngine,
        submitUnpaidBasket,
      ],
    );

    return (
      <div className={classes.container}>
        <div className={classes.billingGroupSelector}>
          {!!establishmentBillingGroups && (
            <CheckoutBillingGroupSelector
              enableMultiLocalization={isMultiLocalizationEnabled}
              establishmentBillingGroups={establishmentBillingGroups}
              selectedEstablishmentBillingGroup={
                selectedEstablishmentBillingGroup
              }
              setIsEstablishmentBillingGroupSelected={
                setIsEstablishmentBillingGroupSelected
              }
              setSelectedEstablishmentBillingGroup={
                setSelectedEstablishmentBillingGroup
              }
            />
          )}
          {showAcceptTermsAndConditions &&
            generalTermsAndConditions &&
            termsAndConditionsAccepted === undefined &&
            !fromApp && (
              <AcceptTermsAndConditions
                accepted={areTermsAndConditionsAccepted}
                onChecked={handleAcceptTermsandConditions}
                termsAndConditions={generalTermsAndConditions}
                type={TermsAndConditionType.TERMS_AND_CONDITIONS}
              />
            )}
        </div>

        {showStripeExpressCheckout && (
          <div className={classes.expressCheckoutContainer}>
            <StripeExpressCheckoutElement
              clientSecret={clientSecret}
              disabled={!areTermsAndConditionsAccepted}
              onError={handleExpressCheckoutError}
              onLoadError={() => setAvailableExpressCheckoutMethods(false)}
              onReady={handleExpressCheckoutReady}
              onSuccessfulPayment={onSuccessfulPayment}
            />
          </div>
        )}
        <PaymentMethodCardSelector
          paymentMethodChoices={paymentMethodAvailableBasket}
          paymentMethodSelected={paymentMethodSelected}
          paymentProcessing={isPaymentProcessing}
          selectPaymentMethod={handleSelectPaymentMethod}
          {...(showStripeExpressCheckout
            ? { title: t('paymentMethod.select.orPayUsing') }
            : {})}
        />
        {!!instalmentPaymentConfigurations?.length &&
          !!selectInstalmentPayment &&
          selectedPaymentEngine !== PAYMENT_ENGINE_PAYPAL &&
          paymentMethodSelected !== PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT && (
            <InstalmentPaymentSelector
              basketPriceCts={
                basketTotalPriceCts - (basketTotalPricePrepaidLinesCts || 0)
              }
              fromApp={fromApp}
              instalmentPaymentConfigurationList={
                instalmentPaymentConfigurations
              }
              instalmentPaymentConfigurationSelectedId={
                instalmentPaymentSelectedId as number
              }
              onSelectInstalmentPayment={selectInstalmentPayment}
              paymentProcessing={isPaymentProcessing}
            />
          )}
        {isOnlinePaymentLoading ? (
          <CircularProgress />
        ) : (
          <div className={classes.innerContainer}>
            {selectedPaymentEngine === PAYMENT_ENGINE_STRIPE && (
              <PaymentStripeRevamped
                ref={paymentStripeRef}
                allowConsumerToUseInternalAccount={
                  isConsumerAllowedToUseInternalAccount
                }
                basketId={basketId}
                basketTotalPriceCts={basketTotalPriceCts}
                cardBillingDetailsMandatory={
                  isCardBillingDetailsMandatory && false
                }
                // @ts-expect-error checkItemsBasket is supposed to return Promise<boolean>
                checkItemsBasket={checkBasketItems}
                clientSecret={clientSecret}
                companyId={companyId}
                createPendingBookingsIfNecessary={
                  createPendingBookingsIfNecessary
                }
                creditAccountBalance={creditAccountBalance}
                detachPaymentMethod={detachPaymentMethod}
                detachPaymentMethodLoading={
                  isDetachPaymentMethodLoading || isPaymentProcessing
                }
                forceHideConfirmPaymentButton={hideConfirmPaymentButton}
                fromApp={fromApp}
                instalmentPaymentSelectedId={instalmentPaymentSelectedId}
                invalidatePendingBookingsIfNecessary={
                  invalidatePendingBookingsIfNecessary
                }
                isEstablishmentBillingGroupSelected={
                  isEstablishmentBillingGroupSelected
                }
                loading={
                  isPaymentProcessing ||
                  isSettingUpPayment ||
                  isCompanyThemeLoading
                }
                memberId={memberId}
                onCancel={onCancelPaymentBeforeConfirming}
                onError={onConfirmPaymentError}
                onSuccess={onSuccessfulPayment}
                paymentGroupId={paymentGroupId}
                paymentGroupPriceCts={paymentGroupPriceCts}
                paymentMethodSelected={paymentMethodSelected}
                sepaDefaultEmail={sepaDefaultEmail}
                sepaDefaultName={sepaDefaultName}
                setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
                setPaymentProcessing={handleSetPaymentProcessing}
                setTermsAndConditionsAccepted={setAreTermsAndConditionsAccepted}
                stripePaymentElementConfig={{
                  isDefaultForRegion:
                    companyTheme?.is_default_for_region ?? false,
                  stripeId: companyTheme?.stripe_id ?? null,
                }}
                useInternalAccount={useInternalAccount}
              />
            )}
            {selectedPaymentEngine === PAYMENT_ENGINE_PAYPAL && (
              <PaymentPaypal
                ref={paymentPaypalRef}
                allowConsumerToUseInternalAccount={
                  isConsumerAllowedToUseInternalAccount
                }
                basketId={basketId}
                basketPriceCts={
                  basketTotalPriceCts - (basketTotalPricePrepaidLinesCts || 0)
                }
                clientSecret={clientSecret}
                clientSecretLoading={isClientSecretLoading}
                creditAccountBalance={creditAccountBalance}
                forceHideConfirmPaymentButton={hideConfirmPaymentButton}
                fromApp={fromApp}
                isEstablishmentBillingGroupSelected={
                  isEstablishmentBillingGroupSelected
                }
                loading={isBasketLoading || isCurrentBasketProcessing}
                onCancel={onCancelPaymentBeforeConfirming}
                onError={onConfirmPaymentError}
                onSuccess={onSuccessfulPayment}
                paymentGroupId={paymentGroupId}
                paymentProcessing={isPaymentProcessing}
                setPaymentProcessing={handleSetPaymentProcessing}
                termsAndConditionsAccepted={areTermsAndConditionsAccepted}
                useInternalAccount={useInternalAccount}
              />
            )}
          </div>
        )}
      </div>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  innerContainer: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  priceContainer: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    margin: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingGroupSelector: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  expressCheckoutContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));
