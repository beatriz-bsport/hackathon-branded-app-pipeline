import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_BASKET,
} from '@bsport/common/lib/master-data/payment-group.js';

import { QuicksalePaymentMethod } from '#src/libs/quicksale/constants';
import useFeaturesProvider from '#src/libs/company/hooks/feature-list-provider.hook';
import { requestClientSecret as requestClientSecretAPI } from '#src/libs/invoice/api';

import type { Basket } from '#src/libs/checkout/types';

type UseQuicksalePaymentsProps = {
  basket: Basket;
  setLoading: (loading: boolean) => void;
};

const useQuicksalePayments = ({
  basket,
  setLoading,
}: UseQuicksalePaymentsProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentGroupId, setPaymentGroupId] = useState<number | null>(null);
  const [paymentGroupPriceCts, setPaymentGroupPriceCts] = useState<
    number | null
  >(null);

  const { stripeTerminalEnabled } = useFeaturesProvider();

  const [[paymentEngine, paymentMethod], setPaymentInfo] = useState<
    [
      typeof PAYMENT_ENGINE_BSPORT | typeof PAYMENT_ENGINE_STRIPE | null,
      QuicksalePaymentMethod | null,
    ]
  >([null, null]);

  const setPaymentMethod = useCallback(
    (newPaymentMethod: QuicksalePaymentMethod) => {
      if (newPaymentMethod === QuicksalePaymentMethod.Manual) {
        setPaymentInfo([PAYMENT_ENGINE_BSPORT, newPaymentMethod]);
      } else {
        setPaymentInfo([PAYMENT_ENGINE_STRIPE, newPaymentMethod]);
      }
    },
    [],
  );

  // ========== Available Payment Methods ==========
  // (Quicksale MVP): Only StripeTerminal and Manual payment methods are available
  const availablePaymentMethods: QuicksalePaymentMethod[] = useMemo(
    () => [
      ...(stripeTerminalEnabled ? [QuicksalePaymentMethod.StripeTerminal] : []),
      QuicksalePaymentMethod.Manual,
    ],
    [stripeTerminalEnabled],
  );

  // ========== Fetch/Refresh Payment Group ==========
  const fetchOrRefreshPaymentGroup = useCallback(() => {
    if (paymentEngine !== null && basket) {
      setLoading(true);
      requestClientSecretAPI(paymentEngine, PAYMENT_INTENT_TYPE_BASKET, {
        basket: basket.id,
        is_physical_payment_intent:
          paymentMethod === QuicksalePaymentMethod.StripeTerminal,
      })
        .then(({ data }) => {
          setClientSecret(data.client_secret);
          setPaymentGroupId(data.payment_group);
          setPaymentGroupPriceCts(data.price_cts);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [basket, paymentEngine, paymentMethod, setLoading]);

  useEffect(() => {
    if (availablePaymentMethods.length > 0) {
      setPaymentMethod(availablePaymentMethods[0]);
    }
  }, [availablePaymentMethods, setPaymentMethod]);

  useEffect(() => {
    fetchOrRefreshPaymentGroup();
  }, [basket?.id, fetchOrRefreshPaymentGroup]);

  return {
    clientSecret,
    setClientSecret,
    isProcessing,
    setIsProcessing,
    paymentGroupId,
    setPaymentGroupId,
    paymentGroupPriceCts,
    setPaymentGroupPriceCts,
    paymentMethod,
    setPaymentMethod,
    availablePaymentMethods,
    fetchOrRefreshPaymentGroup,
  };
};

export default useQuicksalePayments;
