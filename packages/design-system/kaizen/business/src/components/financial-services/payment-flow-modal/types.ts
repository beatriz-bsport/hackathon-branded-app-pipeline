import type { ReactNode } from "react";
import type { RefObject } from "react";

import type { Fetch } from "@bsport/fetch";
import type { SelectedDate } from "@bsport/kaizen-primitive-core";

import type { AllPaymentMethodKey } from "#src/components/financial-services/payment-method-selector/constants";
import type { PaymentMethodSelectorSelection } from "#src/components/financial-services/payment-method-selector/types";

import type { PaymentTab } from "./payment-flow-form";
import type { PaymentFlowGiftCard } from "./payment-methods/gift-card/types";
import type { ManualMethodType } from "./payment-methods/manual/types";
import type { StripePaymentMethodHandle } from "./payment-methods/stripe/types";

export type PaymentFlowModalProps = {
  isOpen: boolean;
  invoiceId: string;
  memberId: number;
  fetch: Fetch;
  onClose: () => void;
  onConfirm?: () => void;
};

export type PaymentFlowModalBodyState = {
  memberId: number;
  fetch: PaymentFlowModalProps["fetch"];
  activeTab: PaymentTab;
  setActiveTab: (tab: PaymentTab) => void;
  isPartialEnabled: boolean;
  setIsPartialEnabled: (enabled: boolean) => void;
  amountToPay: string;
  isInvoiceAlreadyPaid: boolean;
  shouldShowMemberBalanceWarning: boolean;
  submitError: string | null;
  hasPositiveAccountBalance: boolean;
  isAccountBalanceEnough: boolean;
  accountBalance: number;
  hiddenAllMethodIds: AllPaymentMethodKey[];
  onSelectionChange: (selection: PaymentMethodSelectorSelection) => void;
  renderSelectedPaymentMethod: () => ReactNode;
  memberName: string;
  invoiceUrl: string;
  memberUrl: string;
};

export type ConfirmPaymentFormValues = {
  savePaymentMethod: boolean;
  terminalReaderId: string | null;
  manualType: ManualMethodType;
  manualDate: SelectedDate;
  manualNote: string;
  selectedGiftCardId: number | null;
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
