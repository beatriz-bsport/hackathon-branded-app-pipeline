import React, { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';

import type { OptionCallback } from '#src/state/types';
import type { Basket, PrepaidLine } from '#src/libs/checkout/types';
import type { StripePaymentElementConfig } from '#src/libs/company/types';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import type { InstalmentPaymentApiWithBasketId } from '#src/libs/instalment-payment-configuration/types';

import OnlinePayment from '#src/libs/payment/components/OnlinePayment.component';
import { BasketNullPrice } from '#src/libs/checkout/components/new-checkout-flow/BasketNullPrice.component';
import { verifyPriceBasket as verifyPriceBasketAPI } from '#src/libs/payment/api';

type PaymentStepProps = {
  allowConsumerToUseInternalAccount: boolean;
  basket: Basket<string, PrepaidLine>;
  checkItemsBasket: (basketId: string) => boolean;
  clientSecret: string | null;
  companyId: number;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  invalidatePendingBookingsIfNecessary?: () => void;
  creditAccountBalance?: number;
  detachPaymentMethod: (paymentMethodId: string) => void;
  detachPaymentMethodLoading: boolean;
  instalmentPaymentConfigurationList?: InstalmentPaymentApiWithBasketId[];
  isEstablishmentBillingGroupSelected?: boolean;
  isOnlinePaymentAvailable: boolean;
  isPayLaterAvailable: boolean;
  isTotalPriceNull: boolean;
  loading: boolean;
  onSelectInstalmentPayment: (
    id: number,
    options?: OptionCallback<Basket>,
  ) => void;
  onPaymentSuccess: (callback?: () => void) => void;
  paymentGroupId: number;
  paymentGroupPriceCts: number;
  paymentMethodChoices: any;
  paymentProcessing: boolean;
  ref: React.Ref<any>;
  sepaDefaultEmail: string;
  sepaDefaultName: string;
  setIsOnlinePaymentDisabled: (isLoading: boolean) => void;
  setPaymentProcessing?: (process: boolean) => void;
  setTermsAndConditionsAccepted: (
    areTermsAndConditionsAccepted: boolean,
  ) => void;
  snackbarErrorMsg: (msg: string) => void;
  stripePaymentElementConfig: StripePaymentElementConfig;
  termsAndConditions: string;
  termsAndConditionsAccepted: boolean;
  useInternalAccount?: (amount: number) => void;
  validateUnpaid: (options: OptionCallback) => void;
  cardBillingDetailsMandatory: boolean;
  basketHasOffers: boolean;
  enableMultiLocalization: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  setSelectedEstablishmentBillingGroup: (
    value: React.SetStateAction<EstablishmentBillingGroup>,
  ) => void;
  setIsEstablishmentBillingGroupSelected: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
  clientSecretLoading: boolean;
  paymentEngine: number;
  setPaymentEngine: (paymentEngine: number) => void;
  refreshBasket: (options?: OptionCallback) => void;
};

export const PaymentStep: React.FC<PaymentStepProps> = forwardRef(
  (
    {
      allowConsumerToUseInternalAccount,
      basket,
      checkItemsBasket,
      clientSecret,
      companyId,
      createPendingBookingsIfNecessary,
      creditAccountBalance,
      detachPaymentMethod,
      detachPaymentMethodLoading,
      instalmentPaymentConfigurationList,
      invalidatePendingBookingsIfNecessary,
      isEstablishmentBillingGroupSelected,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      loading,
      onSelectInstalmentPayment,
      onPaymentSuccess,
      paymentGroupId,
      paymentGroupPriceCts,
      paymentMethodChoices,
      paymentProcessing,
      sepaDefaultEmail,
      sepaDefaultName,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      setTermsAndConditionsAccepted,
      snackbarErrorMsg,
      stripePaymentElementConfig,
      termsAndConditions,
      termsAndConditionsAccepted,
      useInternalAccount,
      validateUnpaid,
      cardBillingDetailsMandatory,
      basketHasOffers,
      enableMultiLocalization,
      establishmentBillingGroups,
      setSelectedEstablishmentBillingGroup,
      setIsEstablishmentBillingGroupSelected,
      selectedEstablishmentBillingGroup,
      clientSecretLoading,
      paymentEngine,
      setPaymentEngine,
      refreshBasket,
    },
    ref,
  ) => {
    const { t } = useTranslation('checkout');
    const onlinePaymentRef = React.useRef(null);

    useImperativeHandle(ref, () => {
      return {
        onPaymentConfirm: (event: React.FormEvent<HTMLFormElement>) => {
          if (isTotalPriceNull) {
            onSubmitUnpaid();
          } else {
            onlinePaymentRef.current.onPaymentConfirm(event);
          }
        },
        onPayLaterSubmit: onSubmitUnpaid,
        onPayPalCreateOrder: onlinePaymentRef.current?.onPayPalCreateOrder,
        onPayPalApprove: onlinePaymentRef.current?.onPayPalApprove,
        onPayPalCancel: onlinePaymentRef.current?.onPayPalCancel,
        onPayPalError: onlinePaymentRef.current?.onPayPalError,
      };
    });

    const onSubmitUnpaid = React.useCallback(async () => {
      setPaymentProcessing(true);
      /**
       * checkItemsBasket and verifyPriceBasketAPI are intentionally not moved to a Redux action because:
       * 1. They are always executed within the context of a checkout process, specifically inside an iframe widget.
       * 2. The data returned by these API calls do not need to be stored or managed within the Redux store.
       * Therefore, keeping these API calls local to this context is more appropriate and efficient.
       */
      const basketItemsChecked = await checkItemsBasket(basket.id);
      if (!basketItemsChecked) {
        setPaymentProcessing(false);
        return;
      }
      const { data } = await verifyPriceBasketAPI(basket.id);
      if (
        (!!basket.total_price_cts || basket.total_price_cts === 0) &&
        basket.total_price_cts !== data
      ) {
        setPaymentProcessing(false);

        window.alert(t('myBasket.error.inconsistentBasket'));
        window.location.reload();
        return;
      }
      validateUnpaid({
        onSuccess: () => {
          setPaymentProcessing(false);
        },
        onError: () => setPaymentProcessing(false),
      });
    }, [basket, checkItemsBasket, setPaymentProcessing, t, validateUnpaid]);

    if (isTotalPriceNull || (isPayLaterAvailable && !isOnlinePaymentAvailable))
      return (
        <BasketNullPrice
          areTermsAndConditionsAccepted={termsAndConditionsAccepted}
          basketHasOffers={basketHasOffers}
          enableMultiLocalization={enableMultiLocalization}
          establishmentBillingGroups={establishmentBillingGroups}
          selectedEstablishmentBillingGroup={selectedEstablishmentBillingGroup}
          setIsEstablishmentBillingGroupSelected={
            setIsEstablishmentBillingGroupSelected
          }
          setSelectedEstablishmentBillingGroup={
            setSelectedEstablishmentBillingGroup
          }
        />
      );

    return (
      <>
        {isOnlinePaymentAvailable && (
          <OnlinePayment
            ref={onlinePaymentRef}
            allowConsumerToUseInternalAccount={
              allowConsumerToUseInternalAccount
            }
            basketId={basket.id}
            basketTotalPriceCts={basket.total_price_cts}
            basketTotalPricePrepaidLines={basket?.total_price_prepaid_lines_cts}
            cardBillingDetailsMandatory={cardBillingDetailsMandatory}
            checkItemsBasket={checkItemsBasket}
            clientSecret={clientSecret}
            clientSecretLoading={clientSecretLoading}
            companyId={companyId}
            createPendingBookingsIfNecessary={createPendingBookingsIfNecessary}
            creditAccountBalance={creditAccountBalance}
            detachPaymentMethod={detachPaymentMethod}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            enableMultiLocalization={enableMultiLocalization}
            establishmentBillingGroups={establishmentBillingGroups}
            instalmentPaymentConfigurationList={
              instalmentPaymentConfigurationList
            }
            instalmentPaymentSelectedId={basket?.instalment_payment}
            invalidatePendingBookingsIfNecessary={
              invalidatePendingBookingsIfNecessary
            }
            isEstablishmentBillingGroupSelected={
              isEstablishmentBillingGroupSelected
            }
            loading={loading}
            memberId={basket.member}
            onError={refreshBasket}
            onSelectInstalmentPayment={onSelectInstalmentPayment}
            onSuccess={onPaymentSuccess}
            paymentEngine={paymentEngine}
            paymentGroupId={paymentGroupId}
            paymentGroupPriceCts={paymentGroupPriceCts}
            paymentMethodChoices={paymentMethodChoices}
            paymentProcessing={paymentProcessing}
            selectedEstablishmentBillingGroup={
              selectedEstablishmentBillingGroup
            }
            sepaDefaultEmail={sepaDefaultEmail}
            sepaDefaultName={sepaDefaultName}
            setIsEstablishmentBillingGroupSelected={
              setIsEstablishmentBillingGroupSelected
            }
            setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
            setPaymentEngine={setPaymentEngine}
            setPaymentProcessing={setPaymentProcessing}
            setSelectedEstablishmentBillingGroup={
              setSelectedEstablishmentBillingGroup
            }
            setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
            snackbarErrorMsg={snackbarErrorMsg}
            stripePaymentElementConfig={stripePaymentElementConfig}
            termsAndConditions={termsAndConditions}
            termsAndConditionsAccepted={termsAndConditionsAccepted}
            useInternalAccount={useInternalAccount}
          />
        )}
      </>
    );
  },
);
