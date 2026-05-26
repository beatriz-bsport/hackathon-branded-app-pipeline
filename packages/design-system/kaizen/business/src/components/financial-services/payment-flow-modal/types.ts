import type { ReactNode, RefObject } from "react";

import type { CompanyTheme } from "@bsport/api-core";
import type { Fetch } from "@bsport/fetch";
import type { SelectedDate } from "@bsport/kaizen-primitive-core";

import type { AllPaymentMethodKey } from "#src/components/financial-services/payment-method-selector/constants";
import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";

import type { PaymentFlowGiftCard } from "./components/payment-methods/gift-card/types";
import type { ManualMethodType } from "./components/payment-methods/manual/types";
import type { StripePaymentMethodHandle } from "./components/payment-methods/stripe/types";
import type { PaymentTab } from "./lib/payment-flow-form";

export type PaymentFlowModalProps = {
  isOpen: boolean;
  invoiceId: string;
  memberId: number;
  fetch: Fetch;
  onClose: () => void;
  onConfirm?: (remainingAmountCts: number) => void;
  companyTheme?: CompanyTheme;
};

export type PaymentFlowModalBodyState = {
  memberId: number;
  fetch: Fetch;
  activeTab: PaymentTab;
  setActiveTab: (tab: PaymentTab) => void;
  installmentsTabDisabled: boolean;
  installmentsTabTooltip: string | undefined;
  isPartialEnabled: boolean;
  setIsPartialEnabled: (enabled: boolean) => void;
  onPartialAmountFocus: () => void;
  onPartialAmountBlur: () => void;
  partialAmountCts: number;
  partialAmountError: string | null;
  remainingAmountText: string | null;
  isPartialSupportedForSelectedMethod: boolean;
  amountToPay: string;
  isInvoiceAlreadyPaid: boolean;
  shouldShowMemberBalanceWarning: boolean;
  submitError: string | null;
  hasPositiveAccountBalance: boolean;
  isAccountBalanceEnough: boolean;
  accountBalance: number;
  hiddenAllMethodIds: AllPaymentMethodKey[];
  disabledAllMethodIds: AllPaymentMethodKey[];
  onSelectionChange: (selection: PaymentMethodSelectorSelection) => void;
  renderSelectedPaymentMethod: () => ReactNode;
  memberName: string;
  invoiceUrl: string;
  memberUrl: string;
  installmentScheduleDetail: string | null;
  installmentPerIntervalCaption: string | null;
  invoiceRemainingAmountCts: number;
};

export type ConfirmPaymentFormValues = {
  savePaymentMethod: boolean;
  terminalReaderId: string | null;
  manualType: ManualMethodType;
  manualDate: SelectedDate;
  manualNote: string;
  selectedGiftCardId: number | null;
  partialAmountCts: number;
};

export type ExecuteConfirmPaymentParams = {
  fetch: Fetch;
  invoiceId: string;
  invoiceRemainingAmount?: number;
  selectedPaymentMethod: PaymentMethodSelectorSelection;
  paymentClientSecret: {
    client_secret?: string;
    payment_group?: number;
    price_cts?: number;
  };
  formValues: ConfirmPaymentFormValues;
  availableGiftCards: PaymentFlowGiftCard[];
  cardPaymentRef: RefObject<StripePaymentMethodHandle | null>;
  sepaPaymentRef: RefObject<StripePaymentMethodHandle | null>;
};
