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

export type PaymentFlowStartTrigger =
  | "checkout_flow"
  | "invoice"
  | "unpaid_invoice_component";

type BasePayload = {
  basket_session_id?: string;
  member_id: number;
  invoice_id: string;
  total_amount_to_pay: number;
  payment_method_selected: string | null;
};

type AmountPayload = BasePayload & { amount_to_pay: number };

type StartPayload = BasePayload & {
  payment_start_trigger: PaymentFlowStartTrigger;
  origin_url?: string;
};

export type PaymentFlowEventPayloadMap = {
  payment_flow_start: StartPayload;
  payment_flow_one_time_selected: BasePayload;
  payment_flow_installments_selected: BasePayload;
  payment_flow_payment_method_selected: AmountPayload;
  payment_flow_partial_payment_toggle_on: AmountPayload;
  payment_flow_partial_payment_toggle_off: AmountPayload;
  payment_flow_invoice_button_clicked: AmountPayload;
  payment_flow_member_button_clicked: AmountPayload;
  payment_flow_confirm_button_clicked: AmountPayload;
  payment_flow_cancel_button_clicked: AmountPayload;
  payment_flow_click_outside: AmountPayload;
  payment_flow_cross_button_clicked: AmountPayload;
  payment_flow_escape_key_pressed: AmountPayload;
};

export type PaymentFlowEventName = keyof PaymentFlowEventPayloadMap;

export type PaymentFlowTrackFn = <E extends PaymentFlowEventName>(
  eventName: E,
  properties: PaymentFlowEventPayloadMap[E],
) => void;

export type PaymentFlowModalProps = {
  isOpen: boolean;
  invoiceId: string;
  memberId: number;
  fetch: Fetch;
  onClose: () => void;
  onConfirm?: (remainingAmountCts: number) => void;
  companyTheme?: CompanyTheme;
  onPaymentTrack?: PaymentFlowTrackFn;
  paymentStartTrigger: PaymentFlowStartTrigger;
  trackingSessionId: string;
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
  shouldShowGiftCardInsufficientAlert: boolean;
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
  onInvoiceButtonClick: () => void;
  onMemberButtonClick: () => void;
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
  stripePublishableKey?: string;
};
