export enum BookingActionItemId {
  SWAP_SPOT = "swap-spot-action",
  SWAP_PASS = "swap-pass-action",
  CANCEL_BOOKING = "cancel-booking-action",
  SELL_ITEMS = "sell-items-action",
  RESOLVE_UNPAID_INVOICES = "resolve-unpaid-invoices-action",
  SEND_MESSAGE = "send-message-action",
  COPY_EMAIL = "copy-email-shortcut",
  COPY_PHONE = "copy-phone-shortcut",
}

export const ACTION_ITEM_IDS = [
  BookingActionItemId.SWAP_SPOT,
  BookingActionItemId.SWAP_PASS,
  BookingActionItemId.CANCEL_BOOKING,
  BookingActionItemId.SELL_ITEMS,
  BookingActionItemId.RESOLVE_UNPAID_INVOICES,
  BookingActionItemId.SEND_MESSAGE,
  BookingActionItemId.COPY_EMAIL,
  BookingActionItemId.COPY_PHONE,
] as const;

export type ActionItemId = (typeof ACTION_ITEM_IDS)[number];
