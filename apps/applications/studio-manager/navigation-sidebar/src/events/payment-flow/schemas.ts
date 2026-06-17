import { z } from "zod";

const basePayloadFields = {
  basket_session_id: z
    .string()
    .describe("Session UUID grouping all events for this payment flow"),
  member_id: z.number().describe("Member ID"),
  invoice_id: z.string().describe("Invoice UUID"),
  total_amount_to_pay: z
    .number()
    .describe("Total invoice remaining amount in cents"),
  payment_method_selected: z
    .string()
    .nullable()
    .describe("Identifier of the currently selected payment method"),
} as const;

const amountPayloadFields = {
  ...basePayloadFields,
  amount_to_pay: z
    .number()
    .describe(
      "Amount being charged in cents; may differ from total when partial payment is used",
    ),
} as const;

// --- Start ---
export const paymentFlowStartEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_start"),
    ...basePayloadFields,
    payment_start_trigger: z
      .enum(["checkout_flow", "invoice", "unpaid_invoice_component"])
      .describe("Entry point that opened the payment flow"),
    origin_url: z
      .string()
      .optional()
      .describe("URL of the page where the payment flow was opened"),
  })
  .describe("When the payment flow modal opens");

// --- Tab selection ---
export const paymentFlowOneTimeSelectedEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_one_time_selected"),
    ...basePayloadFields,
  })
  .describe("When the user selects the one-time payment tab");

export const paymentFlowInstallmentsSelectedEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_installments_selected"),
    ...basePayloadFields,
  })
  .describe("When the user selects the installments payment tab");

// --- Payment method ---
export const paymentFlowPaymentMethodSelectedEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_payment_method_selected"),
    ...amountPayloadFields,
  })
  .describe("When the user selects a payment method");

// --- Partial payment toggle ---
export const paymentFlowPartialPaymentToggleOnEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_partial_payment_toggle_on"),
    ...amountPayloadFields,
  })
  .describe("When the user activates the partial payment toggle");

export const paymentFlowPartialPaymentToggleOffEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_partial_payment_toggle_off"),
    ...amountPayloadFields,
  })
  .describe("When the user deactivates the partial payment toggle");

// --- External link buttons ---
export const paymentFlowInvoiceButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_invoice_button_clicked"),
    ...amountPayloadFields,
  })
  .describe("When the user clicks the invoice external link button");

export const paymentFlowMemberButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_member_button_clicked"),
    ...amountPayloadFields,
  })
  .describe("When the user clicks the member external link button");

// --- Confirm ---
export const paymentFlowConfirmButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_confirm_button_clicked"),
    ...amountPayloadFields,
  })
  .describe("When the user submits the payment (confirm/pay button clicked)");

// --- Cancel / dismiss ---
export const paymentFlowCancelButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_cancel_button_clicked"),
    ...amountPayloadFields,
  })
  .describe("When the user closes the payment flow with the cancel button");

export const paymentFlowCrossButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_cross_button_clicked"),
    ...amountPayloadFields,
  })
  .describe("When the user closes the payment flow with the cross button");

export const paymentFlowEscapeKeyPressedEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_escape_key_pressed"),
    ...amountPayloadFields,
  })
  .describe("When the user closes the payment flow by pressing Escape");

export const paymentFlowClickOutsideEventSchema = z
  .object({
    eventType: z.string().default("payment_flow_click_outside"),
    ...amountPayloadFields,
  })
  .describe("When the user closes the payment flow by clicking outside");
