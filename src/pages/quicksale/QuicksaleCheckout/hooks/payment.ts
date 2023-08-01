import React from 'react';
import {
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_BASKET,
} from '@bsport/common/lib/master-data/payment-group';

import { QuicksalePaymentMethod } from '#libs/quicksale/constants';

import useFeaturesProvider from '#libs/company/hooks/feature-list-provider.hook ';

import { requestClientSecret as requestClientSecretAPI } from '../../../../libs/invoice/api';
import type { Theme } from '#libs/theme/types';

const useQuicksalePayments = ({
  basketId,
  setLoading,
  theme,
}: {
  basketId: string;
  setLoading: (loading: boolean) => void;
  theme?: Theme;
}) => {
  // ========== Client secret and payment info ==========
  const [clientSecret, setClientSecret] = React.useState<string>(null);

  const [isProcessing, setIsProcessing] = React.useState(false);

  const [paymentGroupId, setPaymentGroupId] = React.useState<number>(null);

  const [paymentGroupPriceCts, setPaymentGroupPriceCts] =
    React.useState<number>(null);

  const { stripeTerminalEnabled } = useFeaturesProvider();

  const [[paymentEngine, paymentMethod], setPaymentInfo] = React.useState<
    [
      typeof PAYMENT_ENGINE_BSPORT | typeof PAYMENT_ENGINE_STRIPE | null,
      QuicksalePaymentMethod | null,
    ]
  >([null, null]);

  const setPaymentMethod = React.useCallback(
    (newPaymentMethod: QuicksalePaymentMethod) => {
      if (newPaymentMethod === QuicksalePaymentMethod.Manual)
        setPaymentInfo([PAYMENT_ENGINE_BSPORT, newPaymentMethod]);
      else setPaymentInfo([PAYMENT_ENGINE_STRIPE, newPaymentMethod]);
    },
    [],
  );

  const availablePaymentMethods: QuicksalePaymentMethod[] = React.useMemo(
    () => [
      ...(stripeTerminalEnabled ? [QuicksalePaymentMethod.StripeTerminal] : []),
      QuicksalePaymentMethod.Manual,
      QuicksalePaymentMethod.CreditCard,
      ...((theme?.payment_method_available_manager ?? []).includes(
        QuicksalePaymentMethod.Sepa,
      )
        ? [QuicksalePaymentMethod.Sepa]
        : []),
    ],
    [stripeTerminalEnabled, theme.payment_method_available_manager],
  );

  React.useEffect(() => {
    setPaymentMethod(availablePaymentMethods[0]);
  }, [availablePaymentMethods, setPaymentMethod]);

  // Fetch client secret and payment group id
  const fetchOrRefreshPaymentGroup = React.useCallback(() => {
    if (paymentEngine !== null) {
      setLoading(true);
      requestClientSecretAPI(paymentEngine, PAYMENT_INTENT_TYPE_BASKET, {
        basket: basketId,
        is_physical_payment_intent:
          paymentMethod === QuicksalePaymentMethod.StripeTerminal,
      })
        .then(({ data }) => {
          setClientSecret(data.client_secret);
          setPaymentGroupId(data.payment_group);
          setPaymentGroupPriceCts(data.price_cts);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [basketId, paymentEngine, paymentMethod, setLoading]);

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
