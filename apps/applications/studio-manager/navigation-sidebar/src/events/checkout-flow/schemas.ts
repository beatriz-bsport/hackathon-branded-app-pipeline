import { z } from "zod";

const itemTypeValues = [
  "pass",
  "appointment_pass",
  "product",
  "pack",
  "giftcard",
  "subscription",
] as const;

export const BASKET_START_TRIGGERS = [
  "navbar",
  "member_profile_page",
  "offer_page",
] as const;

const basketCancelTriggerValues = [
  "cancel_button",
  "cross_button",
  "escape_key",
] as const;

const basketCompletionTriggerValues = ["confirm"] as const;

// --- Start / entry ---
export const checkoutFlowStartEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_start"),
    basket_session_id: z.string().describe("Session UUID for this modal open"),
    basket_start_trigger: z
      .enum(BASKET_START_TRIGGERS)
      .describe("Entry point that opened the checkout flow"),
    origin_url: z
      .string()
      .optional()
      .describe("URL of the page where the flow was opened"),
    member_id: z.number().optional().describe("Pre-selected member ID if any"),
  })
  .describe("When the checkout flow starts");

// --- Member search modal ---
const memberSearchBase = {
  basket_session_id: z.string().describe("Session UUID"),
  member_id: z.number().optional().describe("Member ID when available"),
} as const;

export const checkoutFlowMemberSearchSelectMemberButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_member_search_select_member_button_clicked"),
    ...memberSearchBase,
  })
  .describe("When the user clicks Select member in the member search modal");

export const checkoutFlowMemberSearchMemberSelectedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_member_search_member_selected"),
    ...memberSearchBase,
  })
  .describe("When a member is selected in the member search modal");

export const checkoutFlowMemberSearchMemberInformationButtonClickedEventSchema =
  z
    .object({
      eventType: z
        .string()
        .default(
          "checkout_flow_member_search_member_information_button_clicked",
        ),
      ...memberSearchBase,
    })
    .describe(
      "When the user clicks the member information button in the member search modal",
    );

export const checkoutFlowMemberSearchEscapeKeyButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_member_search_escape_key_button_clicked"),
    ...memberSearchBase,
  })
  .describe("When the user closes the member search modal with Escape");

export const checkoutFlowMemberSearchCrossButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_member_search_cross_button_clicked"),
    ...memberSearchBase,
  })
  .describe(
    "When the user closes the member search modal with the cross button",
  );

export const checkoutFlowMemberSearchClickOutsideEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_member_search_click_outside"),
    ...memberSearchBase,
  })
  .describe("When the user closes the member search modal by clicking outside");

export const checkoutFlowMemberSearchCancelButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_member_search_cancel_button_clicked"),
    ...memberSearchBase,
  })
  .describe("When the user closes the member search modal with Cancel");

// --- Member card (main modal) ---
export const checkoutFlowMemberEditButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_member_edit_button_clicked"),
    basket_session_id: z.string().describe("Session UUID"),
    member_id: z.number().optional().describe("Current member ID if any"),
  })
  .describe(
    "When the user clicks Edit/Change member to open the member search",
  );

// --- Billing group ---
export const checkoutFlowBillingGroupListClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_billing_group_list_clicked"),
    basket_session_id: z.string().describe("Session UUID"),
    member_id: z.number().optional().describe("Current member ID"),
    billing_group_id_selected: z
      .number()
      .optional()
      .describe("Billing group ID when list is opened"),
  })
  .describe("When the user opens the billing group list");

export const checkoutFlowBillingGroupSelectedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_billing_group_selected"),
    basket_session_id: z.string().describe("Session UUID"),
    member_id: z.number().optional().describe("Current member ID"),
    billing_group_id_selected: z.number().describe("Selected billing group ID"),
  })
  .describe("When the user selects a billing group");

// --- Item type section ---
export const checkoutFlowItemTypeSectionSelectedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_item_type_section_selected"),
    basket_session_id: z.string().describe("Session UUID"),
    item_type: z.enum(itemTypeValues).describe("Selected item type"),
    member_id: z.number().optional().describe("Current member ID"),
  })
  .describe("When the user selects an item type section");

// --- Item selected / clear / add / delete ---
const itemPayloadFields = {
  basket_session_id: z.string().describe("Session UUID"),
  member_id: z.number().optional().describe("Current member ID"),
  item_type: z.enum(itemTypeValues).describe("Item type"),
  item_id: z.number().describe("Item ID"),
  item_name: z.string().describe("Item name"),
  item_price: z.number().describe("Item price in cents"),
  item_quantity: z.number().describe("Item quantity"),
  manual_discount_percentage: z
    .number()
    .optional()
    .describe("Manual discount percentage if set"),
  manual_discount_amount: z
    .number()
    .optional()
    .describe("Manual discount amount in cents if set"),
} as const;

export const checkoutFlowItemSelectedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_item_selected"),
    ...itemPayloadFields,
  })
  .describe(
    "When an item is selected in the add-item form but not yet added to basket",
  );

export const checkoutFlowItemClearButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_item_clear_button_clicked"),
    ...itemPayloadFields,
  })
  .describe("When the user clears the add-item form before adding to basket");

export const checkoutFlowItemAddItemButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_item_add_item_button_clicked"),
    ...itemPayloadFields,
  })
  .describe("When the user adds an item to the basket");

export const checkoutFlowItemDeleteButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_item_delete_button_clicked"),
    ...itemPayloadFields,
  })
  .describe("When the user deletes an item from the basket");

export const checkoutFlowItemUnselectedCrossButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_item_unselected_cross_button_clicked"),
    ...itemPayloadFields,
  })
  .describe("When the user clears the selected item with the cross button");

export const checkoutFlowItemInformationButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_item_information_button_clicked"),
    ...itemPayloadFields,
  })
  .describe("When the user clicks the item information button");

// --- Promo code ---
export const checkoutFlowAddPromoCodeButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_add_promo_code_button_clicked"),
    basket_session_id: z.string().describe("Session UUID"),
    member_id: z.number().optional().describe("Current member ID"),
  })
  .describe("When the user clicks to show the promo code input");

export const checkoutFlowApplyPromoCodeButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_apply_promo_code_button_clicked"),
    basket_session_id: z.string().describe("Session UUID"),
    member_id: z.number().optional().describe("Current member ID"),
    promo_code: z.string().describe("The promo code entered"),
    promo_code_value: z
      .number()
      .optional()
      .describe("Applied promo code value"),
    promo_code_id: z.number().optional().describe("Promo code ID when applied"),
    promo_code_error: z
      .string()
      .optional()
      .describe("Error message when the code fails"),
  })
  .describe("When the user applies a promo code");

export const checkoutFlowDeletePromoCodeButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_delete_promo_code_button_clicked"),
    basket_session_id: z.string().describe("Session UUID"),
    member_id: z.number().optional().describe("Current member ID"),
    promo_code: z.string().describe("The promo code removed"),
    promo_code_value: z
      .number()
      .optional()
      .describe("Promo code value that was applied"),
    promo_code_id: z.number().optional().describe("Promo code ID"),
  })
  .describe("When the user removes a promo code");

// --- Footnote ---
const footnoteBase = {
  basket_session_id: z.string().describe("Session UUID"),
  member_id: z.number().optional().describe("Current member ID"),
  has_footnote: z.boolean().describe("Whether a footnote is present"),
  footnote_length: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Footnote length in characters"),
} as const;

export const checkoutFlowAddFootnoteButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_add_footnote_button_clicked"),
    ...footnoteBase,
  })
  .describe("When the user clicks to add a footnote");

export const checkoutFlowFootnoteEditButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_footnote_edit_button_clicked"),
    ...footnoteBase,
  })
  .describe("When the user clicks to edit the footnote");

export const checkoutFlowFootnoteSaveButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_footnote_save_button_clicked"),
    ...footnoteBase,
  })
  .describe("When the user saves the footnote");

export const checkoutFlowFootnoteDeleteButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_footnote_delete_button_clicked"),
    ...footnoteBase,
  })
  .describe("When the user deletes the footnote");

export const checkoutFlowFootnoteCancelButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_footnote_cancel_button_clicked"),
    ...footnoteBase,
  })
  .describe("When the user cancels the footnote modal");

export const checkoutFlowFootnoteCrossButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_footnote_cross_button_clicked"),
    ...footnoteBase,
  })
  .describe("When the user closes the footnote modal with the cross button");

export const checkoutFlowFootnoteEscapeKeyButtonClickedEventSchema = z
  .object({
    eventType: z
      .string()
      .default("checkout_flow_footnote_escape_key_button_clicked"),
    ...footnoteBase,
  })
  .describe("When the user closes the footnote modal with Escape");

// --- Subscription ---
export const checkoutFlowSubscriptionButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_subscription_button_clicked"),
    basket_session_id: z.string().describe("Session UUID"),
    member_id: z.number().optional().describe("Current member ID"),
  })
  .describe("When the user clicks Go to subscriptions");

// --- Completion ---
export const checkoutFlowCompletionEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_completion"),
    basket_session_id: z.string().describe("Session UUID"),
    basket_completion_trigger: z
      .enum(basketCompletionTriggerValues)
      .describe("Button used to complete (confirm)"),
    member_id: z.number().nullable().describe("Member ID"),
    nb_of_promo_code_applied: z
      .number()
      .describe("Number of promo codes applied"),
    total_item_quantity: z
      .number()
      .describe("Sum of all item quantities in the basket"),
    billing_group_id_selected: z
      .number()
      .nullable()
      .describe("Billing group ID selected"),
    service_date: z
      .string()
      .optional()
      .describe("Service/pass activation date"),
    invoice_creation_success: z
      .boolean()
      .describe("Whether the invoice was created"),
    invoice_creation_error: z
      .string()
      .optional()
      .describe("Error message on failure"),
    invoice_id: z.string().optional().describe("Invoice UUID on success"),
    total_basket_price: z
      .number()
      .describe("Total basket price in cents after tax and reductions"),
    has_footnote: z.boolean().describe("Whether a footnote is present"),
    footnote_length: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .describe("Footnote length in characters"),
  })
  .describe("When the basket is completed (confirm clicked)");

// --- Cancel flow (main modal) ---
const cancelPayloadFields = {
  basket_session_id: z.string().describe("Session UUID"),
  member_id: z.number().nullable().describe("Current member ID if any"),
  nb_of_promo_code_applied: z
    .number()
    .describe("Number of promo codes applied"),
  billing_group_id_selected: z
    .number()
    .nullable()
    .describe("Billing group ID selected"),
  service_date: z.string().optional().describe("Service/pass activation date"),
  invoice_creation_success: z
    .boolean()
    .optional()
    .describe("Whether invoice was created (if attempted)"),
  invoice_id: z.string().optional().describe("Invoice ID if created"),
  invoice_creation_error: z
    .string()
    .optional()
    .describe("Error message if invoice creation failed"),
  total_basket_price: z.number().describe("Total basket price in cents"),
  total_item_quantity: z
    .number()
    .describe("Sum of all item quantities in the basket"),
} as const;

export const checkoutFlowEscapeKeyButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_escape_key_button_clicked"),
    ...cancelPayloadFields,
  })
  .describe("When the user closes the checkout flow with Escape");

export const checkoutFlowCrossButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_cross_button_clicked"),
    ...cancelPayloadFields,
  })
  .describe("When the user closes the checkout flow with the cross button");

export const checkoutFlowCancelButtonClickedEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_cancel_button_clicked"),
    ...cancelPayloadFields,
  })
  .describe("When the user closes the checkout flow with Cancel");

export const checkoutFlowPayCancelEventSchema = z
  .object({
    eventType: z.string().default("checkout_flow_pay_cancel"),
    basket_cancel_trigger: z
      .enum(basketCancelTriggerValues)
      .describe("How the user closed the basket"),
    ...cancelPayloadFields,
  })
  .describe("When the user cancels the checkout flow (aggregate)");
