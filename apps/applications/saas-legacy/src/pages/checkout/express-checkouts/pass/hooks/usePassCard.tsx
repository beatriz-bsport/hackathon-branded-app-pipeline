import React, { useMemo } from 'react';
import { usePassCardDataContext } from '#src/pages/checkout/express-checkouts/pass/context/PassCardDataContext';
import { PaymentPackCard } from '#src/pages/checkout/express-checkouts/pass/components/payment-pack-card/PaymentPackCard';
import { PrivatePassCard } from '#src/pages/checkout/express-checkouts/pass/components/private-pass-card/PrivatePassCard';
import { PassTypes } from '#src/libs/marketplace/types';
import { PaymentComboCard } from '../components/payment-combo-card/PaymentComboCard';

export const usePassCard = () => {
  const { passCardData } = usePassCardDataContext();

  const PassCard = useMemo(() => {
    if (!passCardData) return null;

    if (passCardData.passType === PassTypes.PAYMENTPACK) {
      return <PaymentPackCard />;
    }
    if (passCardData.passType === PassTypes.PRIVATEPASS) {
      return <PrivatePassCard />;
    } else if (passCardData.passType === PassTypes.PAYMENTCOMBO) {
      return <PaymentComboCard />;
    }
    return null;
  }, [passCardData]);

  return {
    PassCard,
    hasData: !!passCardData,
  };
};
