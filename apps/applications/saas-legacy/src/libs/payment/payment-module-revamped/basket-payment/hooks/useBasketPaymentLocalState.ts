import { useState } from 'react';

import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';

import {
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_ENGINE_PAYPAL,
} from '@bsport/common/lib/master-data/payment-group';
import { AxiosError } from 'axios';

export type PaymentEngine =
  | typeof PAYMENT_ENGINE_STRIPE
  | typeof PAYMENT_ENGINE_BSPORT
  | typeof PAYMENT_ENGINE_PAYPAL;

type UseBasketPaymentLocalStateData = {
  isEstablishmentBillingGroupSelected: boolean;
  setIsEstablishmentBillingGroupSelected: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  selectedPaymentEngine: PaymentEngine;
  setSelectedPaymentEngine: React.Dispatch<React.SetStateAction<PaymentEngine>>;
  isPaymentProcessing: boolean;
  setIsPaymentProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup | null;
  setSelectedEstablishmentBillingGroup: React.Dispatch<
    React.SetStateAction<EstablishmentBillingGroup | null>
  >;
  isOnlinePaymentDisabled: boolean;
  setIsOnlinePaymentDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  areTermsAndConditionsAccepted: boolean;
  setAreTermsAndConditionsAccepted: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  checkBasketItemError: AxiosError | null;
  setCheckBasketItemError: React.Dispatch<
    React.SetStateAction<AxiosError | null>
  >;
};

/**
 * Custom hook to manage local state related to the basket payment process.
 *
 * This hook encapsulates various pieces of state that are used throughout
 * the basket payment flow, such as establishment billing group selection,
 * payment engine settings, payment processing status, and terms and conditions acceptance.
 */
export const useBasketPaymentLocalState =
  (): UseBasketPaymentLocalStateData => {
    const [
      isEstablishmentBillingGroupSelected,
      setIsEstablishmentBillingGroupSelected,
    ] = useState(true);

    const [selectedPaymentEngine, setSelectedPaymentEngine] =
      useState<PaymentEngine>(PAYMENT_ENGINE_STRIPE);

    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    const [
      selectedEstablishmentBillingGroup,
      setSelectedEstablishmentBillingGroup,
    ] = useState<EstablishmentBillingGroup | null>(null);

    const [isOnlinePaymentDisabled, setIsOnlinePaymentDisabled] =
      useState(false);

    const [areTermsAndConditionsAccepted, setAreTermsAndConditionsAccepted] =
      useState(false);

    const [checkBasketItemError, setCheckBasketItemError] =
      useState<AxiosError | null>(null);

    return {
      isEstablishmentBillingGroupSelected,
      setIsEstablishmentBillingGroupSelected,
      selectedPaymentEngine,
      setSelectedPaymentEngine,
      isPaymentProcessing,
      setIsPaymentProcessing,
      selectedEstablishmentBillingGroup,
      setSelectedEstablishmentBillingGroup,
      isOnlinePaymentDisabled,
      setIsOnlinePaymentDisabled,
      areTermsAndConditionsAccepted,
      setAreTermsAndConditionsAccepted,
      checkBasketItemError,
      setCheckBasketItemError,
    };
  };
