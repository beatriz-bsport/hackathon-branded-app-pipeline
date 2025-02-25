import React, { forwardRef } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_EPS,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY,
} from '@bsport/common/lib/master-data/payment-group.js';

import {
  TermsAndConditionType,
  type StripeInit,
} from '#src/libs/payment/types';

import AcceptTermsAndConditions from '#src/libs/payment/components/AcceptTermsAndConditions.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { getStripePkKey, getCompanyCountry } from '#src/libs/theme/selectors';
import PaymentStripeBancontact from './PaymentStripeBancontact.component';
import PaymentStripeCard from './PaymentStripeCard.component';
import PaymentStripeEPS from './PaymentStripeEPS.component';
import PaymentStripeGiropay from './PaymentStripeGiropay.component';
import PaymentStripeIdeal from './PaymentStripeIdeal.component';
import PaymentStripeSEPA from './PaymentStripeSEPA.component';
import PaymentStripeSofort from './PaymentStripeSofort.component';

const fallbackStripePromise = loadStripe(getStripePkKey());

type PaymentStripeProps = {
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  applyBalanceToInvoice?: () => void;
  basketId?: string;
  basketTotalPriceCts?: number;
  cardBillingDetailsMandatory: boolean;
  children?: React.ReactNode;
  checkItemsBasket?: (basketId: string) => boolean; // Only necessary if there is there is a basketId
  clientSecret: string;
  companyId: number;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
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
  paymentGroupPriceCts?: number;
  paymentMethodSelected: number;
  ref?: React.Ref<any>;
  sepaDefaultEmail?: string;
  sepaDefaultName?: string;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentProcessing?: (process: boolean) => void;
  setTermsAndConditionsAccepted?: (termsAndConditionsAccepted: boolean) => void;
  stripePromise?: StripeInit;
  termsAndConditions?: string;
  termsAndConditionsAccepted?: boolean;
  useInternalAccount?: (amount: number) => void;
};

type PaymentStripePropsNewCheckoutFlow = Omit<
  PaymentStripeProps,
  'onCancel' | 'paymentGroupPriceCts'
> &
  Partial<PaymentStripeProps>;

const STRIPE_PAYMENT_METHOD_FORM_COMPONENT: { [key: number]: any } = {
  [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: PaymentStripeCard,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: PaymentStripeSEPA,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT]: PaymentStripeBancontact,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL]: PaymentStripeIdeal,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT]: PaymentStripeSofort,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_EPS]: PaymentStripeEPS,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY]: PaymentStripeGiropay,
  // [PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY]: PaymentStripeMobilePay,
  //  [PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT]: PaymentStripeBacsDebit,
};

const PaymentStripe: React.FC<
  PaymentStripeProps | PaymentStripePropsNewCheckoutFlow
> = forwardRef(
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
      paymentMethodSelected,
      sepaDefaultName,
      sepaDefaultEmail,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      setTermsAndConditionsAccepted,
      stripePromise,
      termsAndConditions,
      termsAndConditionsAccepted,
      useInternalAccount,
    },
    ref,
  ) => {
    const companyCountry = getCompanyCountry();

    const StripePaymentMethodForm =
      STRIPE_PAYMENT_METHOD_FORM_COMPONENT[paymentMethodSelected];

    return (
      <Elements stripe={stripePromise ?? fallbackStripePromise}>
        <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.addPaymentMethod">
          {(hasAddPaymentMethodPermission: boolean) => (
            <StripePaymentMethodForm
              ref={ref}
              AcceptTermsAndConditionsComponent={
                termsAndConditions ? (
                  <AcceptTermsAndConditions
                    accepted={termsAndConditionsAccepted}
                    onChecked={setTermsAndConditionsAccepted}
                    termsAndConditions={termsAndConditions}
                    type={TermsAndConditionType.TERMS_AND_CONDITIONS}
                  />
                ) : null
              }
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
              forceSave={!!instalmentPaymentSelectedId}
              fromApp={fromApp}
              hasAddPaymentMethodPermission={hasAddPaymentMethodPermission}
              isEstablishmentBillingGroupSelected={
                isEstablishmentBillingGroupSelected
              }
              loading={loading || applyBalanceLoading}
              memberId={memberId}
              onCancel={onCancel}
              onError={onError}
              onSuccess={onSuccess}
              paymentGroupId={paymentGroupId}
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

export default React.memo(PaymentStripe);
