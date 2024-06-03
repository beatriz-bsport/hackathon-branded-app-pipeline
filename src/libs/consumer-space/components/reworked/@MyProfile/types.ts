import type { PaymentMethod } from '#src/libs/payment/types';

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
  creditAccountBalance: number;
  email: string;
  emergencyContact: string;
  firstName: string;
  gender: string;
  lastName: string;
  memberId: number;
  membershipId: string;
  officialDocumentId: string;
  phoneNumber: string;
  photo: string;
  spiviPrivacySettingsAccepted: boolean;
  spiviPrivacySettingsLoading: boolean;
  totalUnpaidAmount: string;
  updateSpiviPrivacySettings: (memberId: number, value: boolean) => void;
};

export type PaymentMethodsCardProps = {
  paymentMethods: PaymentMethod[];
  paymentMethodLoading: boolean;
  detachPaymentMethodLoading: boolean;
};

export type TermsAndConditionsCardProps = {
  dateJoined: string;
  generalTermsOfUseDateAccepted: string | null;
  generalTermsAndConditionsDateAccepted: string | null;
};

export type ConsumerHeaderProps = {
  isLoading: boolean;
};

export type ConsumerProfileContextType = {
  closeAddPaymentMethodPortal: () => void;
  closeEditProfilePortal: () => void;
  isAddPaymentMethodPortalOpen: boolean;
  isBarcodePortalOpen: boolean;
  isDetachPaymentPortalOpen: boolean;
  isEditProfilePortalOpen: boolean;
  isMobile: boolean;
  isTermsAndConditionPortalOpen: boolean;
  isTermsOfUsePortalOpen: boolean;
  openAddPaymentMethodPortal: () => void;
  openEditProfilePortal: () => void;
  paymentMethodIdToDetach: string;
  selectPaymentMethodToDetach: (id: string) => () => void;
  toggleBarcodeModal: () => void;
  closeDetachPaymentMethodPortal: () => void;
  toggleTermsAndConditionPortal: () => void;
  toggleTermsOfUsePortal: () => void;
};
