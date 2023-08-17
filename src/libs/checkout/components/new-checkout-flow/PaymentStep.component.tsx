import React, { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';

import type { OptionCallback } from '../../../../state/types';
import type { InstalmentPaymentApiWithBasketId } from '#libs/instalment-payment-configuration/types';
import PaymentStripe from '#libs/payment/components/payment-backend-stripe/PaymentStripe.component';
import { BasketNullPrice } from './BasketNullPrice.component';
import type { Basket, PrepaidLine } from '#libs/checkout/types';
import { verifyPriceBasket as verifyPriceBasketAPI } from '#libs/payment/api';

type PaymentStepProps = {
  allowConsumerToUseInternalAccount: boolean;
  basket: Basket<string, PrepaidLine>;
  checkItemsBasket: (basketId: string) => boolean;
  clientSecret: string | null;
  companyId: number;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  creditAccountBalance?: number;
  detachPaymentMethod: (paymentMethodId: string) => void;
  detachPaymentMethodLoading: boolean;
  instalmentPaymentConfigurationList?: InstalmentPaymentApiWithBasketId[];
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
  snackbarSuccessMsg: (msg: string) => void;
  stripeId: string | null;
  termsAndConditions: string;
  termsAndConditionsAccepted: boolean;
  useInternalAccount?: (amount: number) => void;
  validateUnpaid: (options: OptionCallback) => void;
  cardBillingDetailsMandatory: boolean;
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
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      loading,
      onSelectInstalmentPayment,
      onPaymentSuccess,
      paymentGroupId,
      paymentMethodChoices,
      paymentProcessing,
      sepaDefaultEmail,
      sepaDefaultName,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      setTermsAndConditionsAccepted,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      stripeId,
      termsAndConditions,
      termsAndConditionsAccepted,
      useInternalAccount,
      validateUnpaid,
      cardBillingDetailsMandatory,
    },
    ref,
  ) => {
    const { t } = useTranslation('checkout');
    const paymentStripeRef = React.useRef(null);

    useImperativeHandle(ref, () => {
      return {
        onPaymentConfirm: (event: React.FormEvent<HTMLFormElement>) => {
          if (isTotalPriceNull) {
            onSubmitUnpaid();
          } else {
            paymentStripeRef.current.onPaymentConfirm(event);
          }
        },
        onPayLaterSubmit: onSubmitUnpaid,
      };
    });

    const onSubmitUnpaid = React.useCallback(async () => {
      setPaymentProcessing(true);

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
        // eslint-disable-next-line
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
        />
      );

    return (
      <>
        {isOnlinePaymentAvailable && (
          <PaymentStripe
            ref={paymentStripeRef}
            allowConsumerToUseInternalAccount={
              allowConsumerToUseInternalAccount
            }
            basketId={basket.id}
            basketTotalPriceCts={basket.total_price_cts}
            basketTotalPricePrepaidLines={basket?.total_price_prepaid_lines_cts}
            cardBillingDetailsMandatory={cardBillingDetailsMandatory}
            checkItemsBasket={checkItemsBasket}
            clientSecret={clientSecret}
            companyId={companyId}
            createPendingBookingsIfNecessary={createPendingBookingsIfNecessary}
            creditAccountBalance={creditAccountBalance}
            detachPaymentMethod={detachPaymentMethod}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            instalmentPaymentConfigurationList={
              instalmentPaymentConfigurationList
            }
            instalmentPaymentSelectedId={basket?.instalment_payment}
            loading={loading}
            memberId={basket.member}
            onSelectInstalmentPayment={onSelectInstalmentPayment}
            onSuccess={onPaymentSuccess}
            paymentGroupId={paymentGroupId}
            paymentMethodChoices={paymentMethodChoices}
            paymentProcessing={paymentProcessing}
            sepaDefaultEmail={sepaDefaultEmail}
            sepaDefaultName={sepaDefaultName}
            setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
            setPaymentProcessing={setPaymentProcessing}
            setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
            snackbarErrorMsg={snackbarErrorMsg}
            snackbarSuccessMsg={snackbarSuccessMsg}
            stripeId={stripeId}
            termsAndConditions={termsAndConditions}
            termsAndConditionsAccepted={termsAndConditionsAccepted}
            useInternalAccount={useInternalAccount}
          />
        )}
      </>
    );
  },
);
