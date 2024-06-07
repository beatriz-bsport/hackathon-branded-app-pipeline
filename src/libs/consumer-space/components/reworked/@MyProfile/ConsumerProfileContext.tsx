import React, { createContext, ReactNode, useCallback, useState } from 'react';
import useViewport from '#Fabrique/hooks/useViewport';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
import type { ConsumerProfileContextType } from './types';

export const ConsumerProfileContext =
  createContext<ConsumerProfileContextType>(null);

const ConsumerProfileContextProvider: React.FC<{
  children?: ReactNode | undefined;
}> = ({ children }) => {
  const { width } = useViewport();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const [isBarcodePortalOpen, setIsBarcodePortalOpen] = useState(false);

  const [isDetachPaymentPortalOpen, setIsDetachPaymentPortalOpen] =
    useState(false);

  const [isTermsAndConditionPortalOpen, setIsTermsAndConditionPortalOpen] =
    useState(false);

  const [isTermsOfUsePortalOpen, setIsTermsOfUsePortalOpen] = useState(false);

  const [isAddPaymentMethodPortalOpen, setIsAddPaymentMethodPortalOpen] =
    useState(false);

  const [isEditProfilePortalOpen, setIsEditProfilePortalOpen] = useState(false);

  const [paymentMethodIdToDetach, setPaymentMethodIdToDetach] = useState<
    string | null
  >(null);

  // Modal Handlers
  const toggleBarcodeModal = useCallback(() => {
    setIsBarcodePortalOpen((prevState) => !prevState);
  }, []);

  const toggleTermsAndConditionPortal = useCallback(() => {
    setIsTermsAndConditionPortalOpen((prevState) => !prevState);
  }, []);

  const toggleTermsOfUsePortal = useCallback(() => {
    setIsTermsOfUsePortalOpen((prevState) => !prevState);
  }, []);

  const openAddPaymentMethodPortal = useCallback(() => {
    setIsAddPaymentMethodPortalOpen(true);
  }, []);

  const closeAddPaymentMethodPortal = useCallback(() => {
    setIsAddPaymentMethodPortalOpen(false);
  }, []);

  const openEditProfilePortal = useCallback(() => {
    setIsEditProfilePortalOpen(true);
  }, []);

  const closeEditProfilePortal = useCallback(() => {
    setIsEditProfilePortalOpen(false);
  }, []);

  const selectPaymentMethodToDetach = useCallback(
    (id: string) => () => {
      setPaymentMethodIdToDetach(id);
      setIsDetachPaymentPortalOpen(true);
    },
    [],
  );

  const closeDetachPaymentMethodPortal = useCallback(() => {
    setPaymentMethodIdToDetach(null);
    setIsDetachPaymentPortalOpen(false);
  }, []);

  return (
    <ConsumerProfileContext.Provider
      value={{
        closeAddPaymentMethodPortal,
        closeEditProfilePortal,
        isAddPaymentMethodPortalOpen,
        isBarcodePortalOpen,
        isDetachPaymentPortalOpen,
        isEditProfilePortalOpen,
        isMobile,
        isTermsAndConditionPortalOpen,
        isTermsOfUsePortalOpen,
        openAddPaymentMethodPortal,
        openEditProfilePortal,
        paymentMethodIdToDetach,
        selectPaymentMethodToDetach,
        toggleBarcodeModal,
        closeDetachPaymentMethodPortal,
        toggleTermsAndConditionPortal,
        toggleTermsOfUsePortal,
      }}
    >
      {children}
    </ConsumerProfileContext.Provider>
  );
};

export default ConsumerProfileContextProvider;
