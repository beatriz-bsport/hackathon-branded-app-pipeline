import {
  ORDER_STATE_CANCELLED,
  ORDER_STATE_INITIALIZED,
  ORDER_STATE_ONSITEDELIVERY,
  ORDER_STATE_PAID,
  ORDER_STATE_SENT,
} from "@bsport/common/lib/master-data/order-states";

export const ORDER_STATUS_TO_I18N_KEY = {
  [ORDER_STATE_PAID.id]: "toBeProcessed",
  [ORDER_STATE_CANCELLED.id]: "cancelled",
  [ORDER_STATE_ONSITEDELIVERY.id]: "clickAndCollect",
  [ORDER_STATE_SENT.id]: "sent",
  [ORDER_STATE_INITIALIZED.id]: "initialized",
} as const;

export const ORDER_STATUSES = [
  ORDER_STATE_PAID.id,
  ORDER_STATE_CANCELLED.id,
  ORDER_STATE_ONSITEDELIVERY.id,
  ORDER_STATE_SENT.id,
  ORDER_STATE_INITIALIZED.id,
] as Array<0 | 700 | 1100 | 1200 | 9000>;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
