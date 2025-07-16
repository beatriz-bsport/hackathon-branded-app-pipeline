import React, { useMemo } from 'react';
import { usePassCardDataContext } from '#src/pages/checkout/express-checkouts/pass/context/PassCardDataContext';
import { PaymentPackCard } from '#src/pages/checkout/express-checkouts/pass/components/payment-pack-card/PaymentPackCard';
import { PrivatePassCard } from '#src/pages/checkout/express-checkouts/pass/components/private-pass-card/PrivatePassCard';
import { PassTypes } from '#src/libs/marketplace/types';

export const usePassCard = () => {
  const { passCardData } = usePassCardDataContext();

  const PassCard = useMemo(() => {
    if (!passCardData) return null;

    if (passCardData.passType === PassTypes.PAYMENTPACK) {
      return <PaymentPackCard />;
    } else if (passCardData.passType === PassTypes.PRIVATEPASS) {
      return <PrivatePassCard />;
    }
    return null;
  }, [passCardData]);

  return {
    PassCard,
    hasData: !!passCardData,
  };
};
