import React, { createContext, ReactNode, useCallback, useState } from 'react';
import useViewport from '#Fabrique/hooks/useViewport';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';
import type { ConsumerProfileContextType } from './types';
import type { OptionCallback } from '#src/state/types';
import {
  PaymentGroupStatus,
  RequestClientSecretPayload,
} from '#src/libs/invoice/types';
import type {
  MarketingPreferenceUpdatePayload,
  MarketingPreferenceData,
} from '#src/libs/communication/types';

import type { StripePaymentElementConfig } from '#src/libs/company/types';
import type { PaymentGroupBillingEstablishmentPayload } from '#src/libs/payment/types';

export const ConsumerProfileContext =
  createContext<ConsumerProfileContextType>(null);

const ConsumerProfileContextProvider: React.FC<{
  children?: ReactNode | undefined;
  creditAccountBalance: number;
  memberId: number;
  fetchMember: () => void;
  stripePaymentElementConfig: StripePaymentElementConfig;
  availablePaymentMethodList: number[];
  cardBillingDetailsMandatory: boolean;
  companyId: number;
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback<unknown, number>,
  ) => void;
  detachPaymentMethodLoading: boolean;
  fetchMemberPaymentMethod: () => void;
  requestClientSecret: (
    params: {
      payment_engine_identifier: number;
      payment_intent_type: number;
      basket?: string;
      requested_price_cts?: number;
      invoice?: string;
      member?: string;
      is_physical_payment_intent?: boolean;
    },
    options?: OptionCallback<RequestClientSecretPayload>,
  ) => void;
  fetchPaymentGroupStatus: (
    paymentGroupId: number,
    options?: OptionCallback<PaymentGroupStatus>,
  ) => void;
  setPaymentGroupBillingEstablishment: (
    params: PaymentGroupBillingEstablishmentPayload,
    options?: OptionCallback<number>,
  ) => void;
  isFranchiseMarketingPreferencesActivated: boolean;
  franchiseMarketingPreferences: MarketingPreferenceData[];
  updateMyFranchiseMarketingPreferences: (
    {
      franchise_id,
      data,
    }: {
      franchise_id: number;
      data: MarketingPreferenceUpdatePayload[];
    },
    options?: OptionCallback,
  ) => void;
  franchisorId: number | null;
}> = ({
  children,
  creditAccountBalance,
  memberId,
  fetchMember,
  stripePaymentElementConfig,
  availablePaymentMethodList,
  cardBillingDetailsMandatory,
  companyId,
  detachPaymentMethod,
  detachPaymentMethodLoading,
  fetchMemberPaymentMethod,
  requestClientSecret,
  fetchPaymentGroupStatus,
  setPaymentGroupBillingEstablishment,
  isFranchiseMarketingPreferencesActivated,
  franchiseMarketingPreferences,
  updateMyFranchiseMarketingPreferences,
  franchisorId,
}) => {
  const { width } = useViewport();
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  const [isBarcodePortalOpen, setIsBarcodePortalOpen] = useState(false);

  const [isDetachPaymentPortalOpen, setIsDetachPaymentPortalOpen] =
    useState(false);

  const [isTermsAndConditionPortalOpen, setIsTermsAndConditionPortalOpen] =
    useState(false);

  const [isTermsOfUsePortalOpen, setIsTermsOfUsePortalOpen] = useState(false);

  const [isRegularizeBalancePortalOpen, setIsRegularizeBalancePortalOpen] =
    useState(false);

  const [isAddPaymentMethodPortalOpen, setIsAddPaymentMethodPortalOpen] =
    useState(false);

  const [isEditProfilePortalOpen, setIsEditProfilePortalOpen] = useState(false);

  const [isEditProfileMobilePortalOpen, setIsEditProfileMobilePortalOpen] =
    useState(false);

  const [paymentMethodIdToDetach, setPaymentMethodIdToDetach] = useState<
    string | null
  >(null);

  const [
    franchiseMarketingPreferencesPortalOpen,
    setFranchiseMarketingPreferencesPortalOpen,
  ] = useState(false);
  /** Display a message when failed to detach a payment method from widget */
  const [detachPaymentMethodErrorCode, setDetachPaymentMethodErrorCode] =
    useState<number>(null);

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

  const toggleRegularizeBalancePortal = useCallback(() => {
    setIsRegularizeBalancePortalOpen((prevState) => !prevState);
  }, []);

  const toggleFranchiseMarketingPreferencesPortal = useCallback(() => {
    setFranchiseMarketingPreferencesPortalOpen((prevState) => !prevState);
  }, []);

  const handleConfirmRegularizeBalance = () => {
    fetchMember();
    fetchMemberPaymentMethod();
    toggleRegularizeBalancePortal();
  };

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
    setDetachPaymentMethodErrorCode(null);
    setIsDetachPaymentPortalOpen(false);
  }, []);

  // bottom drawer handlers
  const openEditProfileMobilePortal = useCallback(() => {
    setIsEditProfileMobilePortalOpen(true);
  }, []);

  const closeEditProfileMobilePortal = useCallback(() => {
    setIsEditProfileMobilePortalOpen(false);
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
        openEditProfileMobilePortal,
        closeEditProfileMobilePortal,
        isEditProfileMobilePortalOpen,
        paymentMethodIdToDetach,
        selectPaymentMethodToDetach,
        toggleBarcodeModal,
        closeDetachPaymentMethodPortal,
        toggleTermsAndConditionPortal,
        toggleTermsOfUsePortal,
        detachPaymentMethodErrorCode,
        setDetachPaymentMethodErrorCode,
        isRegularizeBalancePortalOpen,
        setIsRegularizeBalancePortalOpen,
        toggleRegularizeBalancePortal,
        creditAccountBalance,
        memberId,
        handleConfirmRegularizeBalance,
        stripePaymentElementConfig,
        availablePaymentMethodList,
        cardBillingDetailsMandatory,
        companyId,
        detachPaymentMethodLoading,
        detachPaymentMethod,
        requestClientSecret,
        fetchPaymentGroupStatus,
        setPaymentGroupBillingEstablishment,
        isFranchiseMarketingPreferencesActivated,
        franchiseMarketingPreferencesPortalOpen,
        toggleFranchiseMarketingPreferencesPortal,
        updateMyFranchiseMarketingPreferences,
        franchiseMarketingPreferences,
        franchisorId,
      }}
    >
      {children}
    </ConsumerProfileContext.Provider>
  );
};

export default ConsumerProfileContextProvider;
