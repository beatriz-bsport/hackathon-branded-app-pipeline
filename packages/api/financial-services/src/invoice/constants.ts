export const BUYABLE_IDENTIFIERS = {
  PASS: 1,
  APPOINTMENT_PASS: 9,
  WEBSHOP_ITEM: 2,
  GIFTCARD: 11,
} as const;

export const INVOICE_STATUSES = {
  DRAFT: "draft",
  OPEN: "open",
  PAID: "paid",
  VOIDED: "voided",
  REFUNDED: "refunded",
} as const;
