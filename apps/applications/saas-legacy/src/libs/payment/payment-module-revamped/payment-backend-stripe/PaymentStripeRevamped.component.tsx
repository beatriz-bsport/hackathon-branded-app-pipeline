import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18n from 'i18next';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementLocale } from '@stripe/stripe-js';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT,
} from '@bsport/common/lib/master-data/payment-group.js';

import { StripePaymentMethodNames } from '#src/libs/payment/constants';
import type { StripePaymentElementConfig } from '#src/libs/company/types';
import { type StripeInit } from '#src/libs/payment/types';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import PaymentStripeCardRevamped from './PaymentStripeCardRevamped.component';
import PaymentStripeGenericElement from '#src/libs/payment/components/payment-backend-stripe/PaymentStripeGenericElement.component';
import PaymentStripeSEPARevamped from './PaymentStripeSEPARevamped.component';

import {
  getCompanyCountry,
  getCurrencyCode,
  getStripePkKey,
} from '#src/libs/theme/selectors';
import { getLocaleFromLanguage } from '#src/utils/language';
import Config from '#src/config';

const fallbackStripePromise = loadStripe(getStripePkKey());

type PaymentStripeProps = {
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  applyBalanceToInvoice?: () => void;
  basketId?: string;
  basketTotalPriceCts?: number;
  cardBillingDetailsMandatory: boolean;
  children?: React.ReactNode;
  checkItemsBasket?: (basketId: string) => boolean; // Only necessary if there is a basketId
  clientSecret: string;
  companyId: number;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  invalidatePendingBookingsIfNecessary?: () => void;
  creditAccountBalance?: number | null;
  detachPaymentMethod: (pm_id: string) => void;
  detachPaymentMethodLoading: boolean;
  forceHideConfirmPaymentButton?: boolean;
  fromApp?: boolean;
  instalmentPaymentSelectedId?: number;
  isEstablishmentBillingGroupSelected?: boolean;
  loading: boolean;
  memberId: number;
  onCancel: () => void;
  onError?: () => void;
  onSuccess: (callback?: () => void) => void;
  paymentGroupId: number;
  paymentGroupPriceCts: number;
  paymentMethodSelected: number;
  ref?: React.Ref<any>;
  sepaDefaultEmail?: string;
  sepaDefaultName?: string;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentProcessing?: (process: boolean) => void;
  setTermsAndConditionsAccepted?: (termsAndConditionsAccepted: boolean) => void;
  stripePaymentElementConfig: StripePaymentElementConfig;
  stripePromise?: StripeInit;
  termsAndConditions?: string;
  termsAndConditionsAccepted?: boolean;
  useInternalAccount?: (amount: number) => void;
};

type PaymentStripePropsNewCheckoutFlow = Omit<PaymentStripeProps, 'onCancel'> &
  Partial<PaymentStripeProps>;

const STRIPE_PAYMENT_METHOD: {
  [key: number]: {
    component: React.ComponentType<any>;
    name: StripePaymentMethodNames;
  };
} = {
  [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: {
    component: PaymentStripeCardRevamped,
    name: StripePaymentMethodNames.CARD,
  },
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: {
    component: PaymentStripeSEPARevamped,
    name: StripePaymentMethodNames.SEPA_DEBIT,
  },
  [PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT]: {
    component: PaymentStripeGenericElement,
    name: StripePaymentMethodNames.BANCONTACT,
  },
  [PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL]: {
    component: PaymentStripeGenericElement,
    name: StripePaymentMethodNames.IDEAL,
  },
  [PAYMENT_GROUP_METHOD_IDENTIFIER_TWINT]: {
    component: PaymentStripeGenericElement,
    name: StripePaymentMethodNames.TWINT,
  },
};

export interface PaymentStripeRevampedHandle {
  onPaymentConfirm: (event: React.FormEvent<HTMLFormElement>) => void;
}

const PaymentStripeRevamped = forwardRef<
  PaymentStripeRevampedHandle,
  PaymentStripeProps | PaymentStripePropsNewCheckoutFlow
>(
  (
    {
      allowConsumerToUseInternalAccount,
      applyBalanceLoading,
      applyBalanceToInvoice,
      basketId,
      basketTotalPriceCts,
      cardBillingDetailsMandatory,
      checkItemsBasket,
      children,
      clientSecret,
      companyId,
      createPendingBookingsIfNecessary,
      invalidatePendingBookingsIfNecessary,
      creditAccountBalance,
      detachPaymentMethod,
      detachPaymentMethodLoading,
      forceHideConfirmPaymentButton,
      fromApp,
      instalmentPaymentSelectedId,
      isEstablishmentBillingGroupSelected = true,
      loading,
      memberId,
      onCancel,
      onSuccess,
      onError,
      paymentGroupId,
      paymentGroupPriceCts,
      paymentMethodSelected,
      sepaDefaultName,
      sepaDefaultEmail,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      stripePaymentElementConfig,
      stripePromise,
      termsAndConditionsAccepted,
      useInternalAccount,
    },
    ref,
  ) => {
    const companyCountry = getCompanyCountry();
    const currency = getCurrencyCode();
    const forceSaveForInstalments = !!instalmentPaymentSelectedId;

    const { language } = i18n;
    const elementLocale = getLocaleFromLanguage(language);

    const [saveForLater, setSaveForLater] = useState(false);

    const handleSaveForLaterChange = useCallback(
      (ev: ChangeEvent<HTMLInputElement>) => {
        setSaveForLater(ev?.target?.checked ?? false);
      },
      [],
    );

    useEffect(() => {
      setSaveForLater(false);
    }, [paymentMethodSelected]);

    const companySetupIntentAlwaysOnSession = [
      'local',
      'dev',
      'staging',
    ].includes(Config.REACT_APP_SENTRY_ENVIRONMENT)
      ? 72
      : 1416;

    const setupFutureUsage = useMemo(() => {
      if (!saveForLater && !forceSaveForInstalments) return null;

      return paymentMethodSelected === PAYMENT_GROUP_METHOD_IDENTIFIER_CB &&
        companyId === companySetupIntentAlwaysOnSession
        ? 'on_session'
        : 'off_session';
    }, [
      companyId,
      companySetupIntentAlwaysOnSession,
      forceSaveForInstalments,
      paymentMethodSelected,
      saveForLater,
    ]);

    const StripePaymentMethodForm =
      STRIPE_PAYMENT_METHOD[paymentMethodSelected]?.component;

    if (!StripePaymentMethodForm) {
      console.warn('Invalid Stripe Payment Method');
      return null;
    }

    return (
      <Elements
        options={{
          mode: 'payment',
          amount: paymentGroupPriceCts,
          paymentMethodTypes: [
            STRIPE_PAYMENT_METHOD[paymentMethodSelected]?.name,
          ],
          currency,
          ...(setupFutureUsage !== undefined ? { setupFutureUsage } : {}),
          ...(!stripePaymentElementConfig.isDefaultForRegion &&
          stripePaymentElementConfig.stripeId
            ? { onBehalfOf: stripePaymentElementConfig.stripeId }
            : {}),
          locale: (elementLocale?.replace('_', '-') ||
            language) as StripeElementLocale,
        }}
        stripe={stripePromise ?? fallbackStripePromise}
      >
        <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.addPaymentMethod">
          {(hasAddPaymentMethodPermission: boolean) => (
            <StripePaymentMethodForm
              ref={ref}
              allowConsumerToUseInternalAccount={
                allowConsumerToUseInternalAccount &&
                (useInternalAccount || applyBalanceToInvoice)
              }
              applyBalanceLoading={applyBalanceLoading}
              applyBalanceToInvoice={applyBalanceToInvoice}
              basketId={basketId}
              basketTotalPriceCts={basketTotalPriceCts}
              cardBillingDetailsMandatory={cardBillingDetailsMandatory}
              checkItemsBasket={checkItemsBasket}
              clientSecret={clientSecret}
              companyCountry={companyCountry}
              companyId={companyId}
              createPendingBookingsIfNecessary={
                createPendingBookingsIfNecessary
              }
              creditAccountBalance={creditAccountBalance}
              detachPaymentMethod={detachPaymentMethod}
              detachPaymentMethodLoading={detachPaymentMethodLoading}
              forceHideConfirmPaymentButton={forceHideConfirmPaymentButton}
              forceSave={forceSaveForInstalments}
              fromApp={fromApp}
              hasAddPaymentMethodPermission={hasAddPaymentMethodPermission}
              invalidatePendingBookingsIfNecessary={
                invalidatePendingBookingsIfNecessary
              }
              isEstablishmentBillingGroupSelected={
                isEstablishmentBillingGroupSelected
              }
              loading={loading || applyBalanceLoading}
              memberId={memberId}
              onCancel={onCancel}
              onError={onError}
              onSaveForLaterChange={handleSaveForLaterChange}
              onSuccess={onSuccess}
              paymentGroupId={paymentGroupId}
              paymentGroupMethodIdentifier={paymentMethodSelected}
              saveForLater={saveForLater}
              setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
              setPaymentProcessing={setPaymentProcessing}
              termsAndConditionsAccepted={termsAndConditionsAccepted}
              useInternalAccount={useInternalAccount}
              userDefaultEmail={sepaDefaultEmail}
              userDefaultName={sepaDefaultName}
            >
              {children ?? null}
            </StripePaymentMethodForm>
          )}
        </ObjectLevelPermissionProvider>
      </Elements>
    );
  },
);

export default React.memo(PaymentStripeRevamped);
