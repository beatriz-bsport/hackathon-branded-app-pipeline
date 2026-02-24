export const INVOICE_CONFIGURATION_QUERY_KEY = "invoice-configuration";
export const INVOICES_QUERY_KEY = "invoices";
export const GIFTCARD_BACKGROUND_LIST_QUERY_KEY = "giftcard-background-list";
export const ESTABLISHMENT_BILLING_GROUPS_QUERY_KEY =
  "establishment-billing-groups";

export const TYPE_TO_IDENTIFIER: Record<string, number> = {
  pass: 1, // PAYMENT_PACK_IDENTIFIER
  appointment_pass: 9, // PRIVATE_PASS_IDENTIFIER
  product: 2, // SHOP_ITEM_IDENTIFIER
  pack: 10, // PAYMENT_COMBO_IDENTIFIER
  giftcard: 11, // GIFTCARD_IDENTIFIER
};

export const GIFTCARD_KIND_EMAIL = 1;
export const GIFTCARD_KIND_PDF = 2;
