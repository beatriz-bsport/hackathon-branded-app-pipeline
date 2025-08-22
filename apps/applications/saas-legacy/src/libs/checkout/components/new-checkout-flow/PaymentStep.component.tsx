import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';

import type { OptionCallback } from '#src/state/types';
import type { Basket, PrepaidLine } from '#src/libs/checkout/types';

import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';

import { BasketNullPrice } from '#src/libs/checkout/components/new-checkout-flow/BasketNullPrice.component';
import { verifyPriceBasket as verifyPriceBasketAPI } from '#src/libs/payment/api';
import { OnlinePaymentBasket } from '#src/libs/payment/payment-module-revamped/basket-payment/OnlinePaymentBasket';

type PaymentStepProps = {
  basket: Basket<string, PrepaidLine>;
  basketHasOffers: boolean;
  checkItemsBasket: (basketId: string) => boolean;
  companyId: number;
  enableMultiLocalization: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  isOnlinePaymentAvailable: boolean;
  isPayLaterAvailable: boolean;
  isTotalPriceNull: boolean;
  onPaymentSuccess: (callback?: () => void) => void;
  onSelectInstalmentPayment: (
    id: number,
    options?: OptionCallback<Basket>,
  ) => void;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
  setIsEstablishmentBillingGroupSelected: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  setPaymentProcessing?: (process: boolean) => void;
  setSelectedEstablishmentBillingGroup: (
    establishmentBillingGroup: EstablishmentBillingGroup,
  ) => void;
  setTermsAndConditionsAccepted: (termsAndConditionsAccepted: boolean) => void;
  termsAndConditionsAccepted: boolean;
  validateUnpaid: (options: OptionCallback) => void;
  ref: React.Ref<any>;
};

export const PaymentStep: React.FC<PaymentStepProps> = forwardRef(
  (
    {
      basket,
      basketHasOffers,
      checkItemsBasket,
      companyId,
      enableMultiLocalization,
      establishmentBillingGroups,
      isOnlinePaymentAvailable,
      isPayLaterAvailable,
      isTotalPriceNull,
      onPaymentSuccess,
      selectedEstablishmentBillingGroup,
      setIsEstablishmentBillingGroupSelected,
      setPaymentProcessing,
      setSelectedEstablishmentBillingGroup,
      setTermsAndConditionsAccepted,
      termsAndConditionsAccepted,
      validateUnpaid,
    },
    ref,
  ) => {
    const { t } = useTranslation('checkout');
    const onlinePaymentRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      onPaymentConfirm: (event: React.FormEvent<HTMLFormElement>) => {
        if (isTotalPriceNull) {
          onSubmitUnpaid();
        } else if (onlinePaymentRef.current?.onPaymentConfirm) {
          onlinePaymentRef.current.onPaymentConfirm(event);
        }
      },
      onPayLaterSubmit: onSubmitUnpaid,
      onPayPalCreateOrder: onlinePaymentRef.current?.onPayPalCreateOrder,
      onPayPalApprove: onlinePaymentRef.current?.onPayPalApprove,
      onPayPalCancel: onlinePaymentRef.current?.onPayPalCancel,
      onPayPalError: onlinePaymentRef.current?.onPayPalError,
    }));

    const onSubmitUnpaid = useCallback(async () => {
      setPaymentProcessing?.(true);
      /**
       * checkItemsBasket and verifyPriceBasketAPI are intentionally not moved to a Redux action because:
       * 1. They are always executed within the context of a checkout process, specifically inside an iframe widget.
       * 2. The data returned by these API calls do not need to be stored or managed within the Redux store.
       * Therefore, keeping these API calls local to this context is more appropriate and efficient.
       */
      const basketItemsChecked = await checkItemsBasket(basket.id);
      if (!basketItemsChecked) {
        setPaymentProcessing?.(false);
        return;
      }
      const { data } = await verifyPriceBasketAPI(basket.id);
      if (
        (!!basket.total_price_cts || basket.total_price_cts === 0) &&
        basket.total_price_cts !== data
      ) {
        setPaymentProcessing?.(false);

        window.alert(t('myBasket.error.inconsistentBasket'));
        window.location.reload();
        return;
      }
      validateUnpaid({
        onSuccess: () => setPaymentProcessing?.(false),
        onError: () => setPaymentProcessing?.(false),
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

    const shouldDisplayOnlinePayment =
      !!basket?.id && !!basket?.total_price_cts;

    return (
      <>
        {isOnlinePaymentAvailable && shouldDisplayOnlinePayment && (
          <OnlinePaymentBasket
            ref={onlinePaymentRef}
            hideConfirmPaymentButton
            basketId={basket.id}
            companyId={companyId}
            onConfirmPaymentSuccess={onPaymentSuccess}
            payerContext={{
              memberId: basket.member,
            }}
            setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
          />
        )}
      </>
    );
  },
);
