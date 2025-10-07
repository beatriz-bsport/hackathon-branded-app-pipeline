import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useBasketPaymentLocalStateUnified } from '#src/libs/checkout/components/new-checkout-flow-unified/hooks/useBasketPaymentLocalStateUnified';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';

type BasketPaymentContextType = {
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
  instalmentPaymentSelectedId: number | null;
  setInstalmentPaymentSelectedId: (id: number | null) => void;
  isEstablishmentBillingGroupSelected: boolean;
  setIsEstablishmentBillingGroupSelected: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup | null;
  setSelectedEstablishmentBillingGroup: React.Dispatch<
    React.SetStateAction<EstablishmentBillingGroup | null>
  >;
  isExpressPayLoading: boolean;
  setIsExpressPayLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const BasketPaymentContext = createContext<BasketPaymentContextType | null>(
  null,
);

type BasketPaymentProviderProps = {
  children: ReactNode;
  initialTermsAccepted?: boolean;
  initialInstalmentPaymentSelectedId?: number | null;
};

export const BasketPaymentProvider: React.FC<BasketPaymentProviderProps> = ({
  children,
  initialTermsAccepted = false,
  initialInstalmentPaymentSelectedId = null,
}) => {
  const {
    isEstablishmentBillingGroupSelected: _isEstablishmentBillingGroupSelected,
    selectedEstablishmentBillingGroup: _selectedEstablishmentBillingGroup,
  } = useBasketPaymentLocalStateUnified();

  const [termsAccepted, setTermsAccepted] = useState(initialTermsAccepted);
  const [instalmentPaymentSelectedId, setInstalmentPaymentSelectedId] =
    useState<number | null>(initialInstalmentPaymentSelectedId);
  const [
    isEstablishmentBillingGroupSelected,
    setIsEstablishmentBillingGroupSelected,
  ] = useState(_isEstablishmentBillingGroupSelected);
  const [
    selectedEstablishmentBillingGroup,
    setSelectedEstablishmentBillingGroup,
  ] = useState(_selectedEstablishmentBillingGroup);
  const [isExpressPayLoading, setIsExpressPayLoading] = useState(false);

  useEffect(() => {
    setIsEstablishmentBillingGroupSelected(
      _isEstablishmentBillingGroupSelected,
    );
  }, [_isEstablishmentBillingGroupSelected]);

  useEffect(() => {
    setSelectedEstablishmentBillingGroup(_selectedEstablishmentBillingGroup);
  }, [_selectedEstablishmentBillingGroup]);

  return (
    <BasketPaymentContext.Provider
      value={{
        termsAccepted,
        setTermsAccepted,
        instalmentPaymentSelectedId,
        setInstalmentPaymentSelectedId,
        isEstablishmentBillingGroupSelected,
        setIsEstablishmentBillingGroupSelected,
        selectedEstablishmentBillingGroup,
        setSelectedEstablishmentBillingGroup,
        isExpressPayLoading,
        setIsExpressPayLoading,
      }}
    >
      {children}
    </BasketPaymentContext.Provider>
  );
};

export const useBasketPaymentContext = (): BasketPaymentContextType => {
  const context = useContext(BasketPaymentContext);
  if (!context) {
    throw new Error(
      'useBasketPaymentContext must be used within a BasketPaymentProvider',
    );
  }
  return context;
};
