import { Dispatch, SetStateAction } from 'react';

import type {
  PaymentGroupBillingEstablishmentPayload,
  PaymentMethod,
} from '#src/libs/payment/types';
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

export type ConsumerSummaryCardProps = {
  acceptEmail: boolean;
  acceptSms: boolean;
  address: {
    address_line_1: string;
    address_line_2: string;
    city: string;
    country: string;
    state: string;
    zipcode: string;
  };
  birthday: string;
  companyId: number;
  creditAccountBalance: number;
  email: string;
  emergencyContact: string;
  firstName: string;
  gender: string;
  isLoading: boolean;
  lastName: string;
  memberId: number;
  membershipId: string;
  officialDocumentId: string;
  phoneNumber: string;
  photo: string;
  iosAppUrl?: string;
  androidAppUrl?: string;
  showAccountBalance: boolean;
  showBarcodeButton: boolean;
  showMembershipNumber: boolean;
  spiviPrivacySettingsAccepted: boolean;
  spiviPrivacySettingsLoading: boolean;
  regularizeBalanceAllowed: boolean;
  updateSpiviPrivacySettings: (memberId: number, value: boolean) => void;
};

export type PaymentMethodsCardProps = {
  paymentMethods: PaymentMethod[];
  paymentMethodLoading: boolean;
  detachPaymentMethodLoading: boolean;
  isLoading: boolean;
};

export type TermsAndConditionsCardProps = {
  dateJoined: string;
  generalTermsOfUseDateAccepted: string | null;
  generalTermsAndConditionsDateAccepted: string | null;
  isLoading: boolean;
};

export type ConsumerHeaderProps = {
  isLoading: boolean;
};

export type ConsumerProfileContextType = {
  closeAddPaymentMethodPortal: () => void;
  closeDetachPaymentMethodPortal: () => void;
  closeEditProfileMobilePortal: () => void;
  closeEditProfilePortal: () => void;
  isAddPaymentMethodPortalOpen: boolean;
  isBarcodePortalOpen: boolean;
  isDetachPaymentPortalOpen: boolean;
  isEditProfilePortalOpen: boolean;
  isEditProfileMobilePortalOpen: boolean;
  isMobile: boolean;
  isTermsAndConditionPortalOpen: boolean;
  isTermsOfUsePortalOpen: boolean;
  openAddPaymentMethodPortal: () => void;
  openEditProfileMobilePortal: () => void;
  openEditProfilePortal: () => void;
  paymentMethodIdToDetach: string;
  selectPaymentMethodToDetach: (id: string) => () => void;
  toggleBarcodeModal: () => void;
  toggleTermsAndConditionPortal: () => void;
  toggleTermsOfUsePortal: () => void;
  detachPaymentMethodErrorCode: number | null;
  setDetachPaymentMethodErrorCode: Dispatch<SetStateAction<number | null>>;
  isRegularizeBalancePortalOpen: boolean;
  setIsRegularizeBalancePortalOpen: Dispatch<SetStateAction<boolean>>;
  toggleRegularizeBalancePortal: () => void;
  creditAccountBalance: number;
  memberId: number;
  handleConfirmRegularizeBalance: () => void;
  stripePaymentElementConfig: StripePaymentElementConfig;
  availablePaymentMethodList: number[];
  cardBillingDetailsMandatory: boolean;
  companyId: number;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback<unknown, number>,
  ) => void;
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
  toggleFranchiseMarketingPreferencesPortal: () => void;
  franchiseMarketingPreferencesPortalOpen: boolean;
  franchisorId: number | null;
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
  franchiseMarketingPreferences: MarketingPreferenceData[];
};
