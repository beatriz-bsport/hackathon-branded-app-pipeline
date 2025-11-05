import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

import { PaymentMethodCardSelector } from '#src/libs/payment/components/PaymentMethodCardSelector.component';
import InstalmentPaymentSelector from '#src/libs/instalment-payment-configuration/components/InstalmentPaymentSelector.component';
import CircularProgress from '@material-ui/core/CircularProgress';
// TODO: FEATURE FLAG WEBVIEW_BASKET_AP_GP - Duplicated file to remove when the feature is validated
import PaymentStripeRevamped from '#src/libs/payment/payment-module-revamped/payment-backend-stripe/APGP/PaymentStripeRevamped.component';
import StripeExpressCheckoutElement from './StripeExpressCheckoutElement.component';
import CheckoutBillingGroupSelector from '#src/libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';
import PaymentPaypal from '#src/libs/payment/components/paypal/PaymentPaypal.component';
import AcceptTermsAndConditions from '#src/libs/payment/components/AcceptTermsAndConditions.component';

import { useBasketPaymentContext } from '#src/libs/checkout/components/new-checkout-flow-unified/BasketPaymentContext';
import { useBasketPaymentActions } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasketPaymentActions';
import { useBasketPaymentStatusTracker } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasketPaymentStatusTracker';
import { useBasketPaymentLocalStateUnified } from './hooks/useBasketPaymentLocalStateUnified';
import { useBasket } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useBasket';
import { useCompanyPaymentSettings } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useCompanyPaymentSettings';
import { useMember } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useMember';
import { usePayment } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/usePayment';
import { usePaymentMethod } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/usePaymentMethod';
import { useMemberPaymentMethodListProvider } from '#src/libs/payment/payment-module-revamped/hooks/useMemberPaymentMethodListProvider';

import { OnlinePaymentBasketRef } from '#src/libs/checkout/components/new-checkout-flow-unified/types';
import type { StripePaymentElementConfig } from '#src/libs/company/types';
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
  showAcceptTermsAndConditions?: boolean;
  displayedAmountToPayCts?: number;
  payerContext: {
    memberId: number;
    fromApp?: boolean;
    termsAndConditionsAccepted?: boolean;
  };
  stripePaymentElementConfig: StripePaymentElementConfig;
  onCancelPaymentBeforeConfirming?: () => void;
  onConfirmPaymentError?: () => void;
  onConfirmPaymentSuccess: (callback?: () => void) => void;
  ref?: React.Ref<any>;
};

export const OnlinePaymentBasketUnified: React.FC<Props> = forwardRef(
  (
    {
      basketId,
      companyId,
      hideConfirmPaymentButton,
      showAcceptTermsAndConditions,
      displayedAmountToPayCts,
      payerContext: { memberId, fromApp, termsAndConditionsAccepted },
      stripePaymentElementConfig,
      onCancelPaymentBeforeConfirming,
      onConfirmPaymentError,
      onConfirmPaymentSuccess,
    },
    ref,
  ) => {
    const classes = useStyles();
    const { t } = useTranslation(['invoice']);

    const paymentRef = React.useRef<OnlinePaymentBasketRef>(null);

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
      isClientSecretLoading,
      paymentGroupId,
      paymentGroupPriceCts,
      useInternalAccount,
      handleFetchInstalmentPaymentByBasket,
      getClientSecret,
      createPendingBookingsAndBlockBasket,
      invalidatePendingBookingsAndUnblockBasket,
    } = usePayment(basketId, companyId, memberId);

    const {
      detachPaymentMethod,
      isDetachPaymentMethodLoading,
      isStripeDomainRegistrationLoading,
      setAvailableExpressCheckoutMethods,
      showStripeExpressCheckout,
    } = usePaymentMethod(basketId, companyId, memberId, {
      clientSecret,
      paymentMethodAvailableBasket,
    });

    const {
      selectedPaymentEngine,
      setIsOnlinePaymentDisabled,
      isOnlinePaymentDisabled,
      setSelectedPaymentEngine,
    } = useBasketPaymentLocalStateUnified(basketId);

    const { isPaymentProcessing, isSettingUpPayment, hasPaymentSucceeded } =
      useBasketPaymentStatusTracker(basketId, memberId);

    const { handleFetchMemberPaymentMethodList } =
      useMemberPaymentMethodListProvider({ memberId });

    const { handleAssignInstalmentPayment } = useBasketPaymentActions(
      basketId,
      companyId,
      memberId,
    );

    const {
      termsAccepted,
      setTermsAccepted,
      instalmentPaymentSelectedId,
      setInstalmentPaymentSelectedId,
      isEstablishmentBillingGroupSelected,
      setIsEstablishmentBillingGroupSelected,
      selectedEstablishmentBillingGroup,
      setSelectedEstablishmentBillingGroup,
      isExpressPayLoading,
    } = useBasketPaymentContext();

    const [paymentMethodSelected, setPaymentMethodSelected] = useState(
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    );

    const isOnlinePaymentLoading =
      !basketTotalPriceCts ||
      !clientSecret ||
      isSettingUpPayment ||
      isStripeDomainRegistrationLoading;

    const isPaymentLoading =
      isPaymentProcessing ||
      isSettingUpPayment ||
      isCompanyThemeLoading ||
      isBasketLoading ||
      isCurrentBasketProcessing ||
      hasPaymentSucceeded ||
      isExpressPayLoading;

    const isExpressCheckoutDisabled =
      (!termsAccepted && !!generalTermsAndConditions?.length) ||
      (!isEstablishmentBillingGroupSelected &&
        !!establishmentBillingGroups?.length) ||
      isPaymentLoading;

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

    const handleAcceptTermsAndConditions = useCallback(
      (accepted: boolean) => setTermsAccepted(accepted),
      [setTermsAccepted],
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
      invalidatePendingBookingsAndUnblockBasket();
      onConfirmPaymentError?.();
    }, [invalidatePendingBookingsAndUnblockBasket, onConfirmPaymentError]);

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

    // This useEffect is mandatory in the new checkout flow, since if this condition is not
    // fullfilled no Stripe PaymentMethodForm component is mounted yet and so we don't want the
    // Pay button to be active
    useEffect(() => {
      setIsOnlinePaymentDisabled(isOnlinePaymentLoading);
    }, [isOnlinePaymentLoading, setIsOnlinePaymentDisabled]);

    useImperativeHandle(
      ref,
      () => ({
        onPaymentConfirm: (event: React.MouseEvent<HTMLElement>) =>
          event && paymentRef?.current?.onPaymentConfirm?.(event),
        onPayLaterSubmit: () =>
          submitUnpaidBasket({ onSuccess: () => onConfirmPaymentSuccess() }),
        onPayPalCreateOrder: paymentRef?.current?.onPayPalCreateOrder,
        onPayPalApprove: paymentRef?.current?.onPayPalApprove,
        onPayPalCancel: paymentRef?.current?.onPayPalCancel,
        onPayPalError: paymentRef?.current?.onPayPalError,
        paymentEngine: selectedPaymentEngine,
        isOnlinePaymentDisabled,
      }),
      [
        isOnlinePaymentDisabled,
        onConfirmPaymentSuccess,
        selectedPaymentEngine,
        submitUnpaidBasket,
      ],
    );

    useEffect(() => {
      getClientSecret(selectedPaymentEngine);
    }, [selectedPaymentEngine]);

    // Prioritize displayedAmountToPayCts if provided over basketTotalPriceCts.
    // This is optional as it is specific to the basket and not Express Pass Checkout & One Click Booking, as it doesn't persist there.
    // basketTotalPriceCts can be refetched after assigning an instalment, which we want to avoid
    // to ensure the basket hasn't changed during the payment process.
    const amountToPayCts =
      displayedAmountToPayCts ??
      basketTotalPriceCts - (basketTotalPricePrepaidLinesCts || 0);

    const allowedWallets = {
      applePay:
        paymentMethodAvailableBasket?.includes(
          PAYMENT_GROUP_METHOD_IDENTIFIER_APPLE_PAY,
        ) ?? false,
      googlePay:
        paymentMethodAvailableBasket?.includes(
          PAYMENT_GROUP_METHOD_IDENTIFIER_GOOGLE_PAY,
        ) ?? false,
    };

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
                setSelectedEstablishmentBillingGroup as any
              }
            />
          )}
          {showAcceptTermsAndConditions &&
            generalTermsAndConditions &&
            !fromApp && (
              <AcceptTermsAndConditions
                accepted={termsAccepted}
                onChecked={handleAcceptTermsAndConditions}
                termsAndConditions={generalTermsAndConditions}
                type={TermsAndConditionType.TERMS_AND_CONDITIONS}
              />
            )}
        </div>

        {showStripeExpressCheckout && (
          <div className={classes.expressCheckoutContainer}>
            <StripeExpressCheckoutElement
              allowedWallets={allowedWallets}
              amountToPayCts={amountToPayCts}
              basketId={basketId}
              checkBasketItems={checkBasketItems}
              clientSecret={clientSecret}
              disabled={isExpressCheckoutDisabled}
              onError={handleExpressCheckoutError}
              onLoadError={() => setAvailableExpressCheckoutMethods(false)}
              onReady={handleExpressCheckoutReady}
              onSuccessfulPayment={onSuccessfulPayment}
              stripePaymentElementConfig={stripePaymentElementConfig}
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
          !!setInstalmentPaymentSelectedId &&
          selectedPaymentEngine !== PAYMENT_ENGINE_PAYPAL &&
          paymentMethodSelected !== PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT && (
            <InstalmentPaymentSelector
              basketPriceCts={amountToPayCts}
              fromApp={fromApp}
              instalmentPaymentConfigurationList={
                instalmentPaymentConfigurations
              }
              instalmentPaymentConfigurationSelectedId={
                instalmentPaymentSelectedId as number
              }
              onSelectInstalmentPayment={(id, options) => {
                setInstalmentPaymentSelectedId(id);
                options?.onSuccess?.();
              }}
              paymentProcessing={isPaymentProcessing}
            />
          )}
        {isOnlinePaymentLoading ? (
          <CircularProgress />
        ) : (
          <div className={classes.innerContainer}>
            {selectedPaymentEngine === PAYMENT_ENGINE_STRIPE && (
              <PaymentStripeRevamped
                ref={paymentRef}
                allowConsumerToUseInternalAccount={
                  isConsumerAllowedToUseInternalAccount
                }
                basketId={basketId}
                basketTotalPriceCts={amountToPayCts}
                cardBillingDetailsMandatory={
                  isCardBillingDetailsMandatory && false
                }
                // @ts-expect-error checkItemsBasket is supposed to return Promise<boolean>
                checkItemsBasket={checkBasketItems}
                clientSecret={clientSecret}
                companyId={companyId}
                createPendingBookingsAndBlockBasket={
                  createPendingBookingsAndBlockBasket
                }
                creditAccountBalance={creditAccountBalance}
                detachPaymentMethod={detachPaymentMethod}
                detachPaymentMethodLoading={
                  isDetachPaymentMethodLoading || isPaymentProcessing
                }
                forceHideConfirmPaymentButton={hideConfirmPaymentButton}
                fromApp={fromApp}
                handleAssignInstalmentPayment={handleAssignInstalmentPayment}
                instalmentPaymentSelectedId={instalmentPaymentSelectedId}
                invalidatePendingBookingsAndUnblockBasket={
                  invalidatePendingBookingsAndUnblockBasket
                }
                isEstablishmentBillingGroupSelected={
                  isEstablishmentBillingGroupSelected
                }
                loading={isPaymentLoading}
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
                setTermsAndConditionsAccepted={setTermsAccepted}
                stripePaymentElementConfig={stripePaymentElementConfig}
                termsAndConditions={generalTermsAndConditions}
                termsAndConditionsAccepted={
                  hideConfirmPaymentButton
                    ? termsAndConditionsAccepted
                    : termsAccepted
                }
                useInternalAccount={useInternalAccount}
              />
            )}
            {selectedPaymentEngine === PAYMENT_ENGINE_PAYPAL && (
              <PaymentPaypal
                ref={paymentRef}
                allowConsumerToUseInternalAccount={
                  isConsumerAllowedToUseInternalAccount
                }
                basketId={basketId}
                basketPriceCts={amountToPayCts}
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
                termsAndConditionsAccepted={termsAccepted}
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
