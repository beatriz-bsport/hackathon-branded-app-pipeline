import {
  ORDER_STATE_CANCELLED,
  ORDER_STATE_INITIALIZED,
  ORDER_STATE_ONSITEDELIVERY,
  ORDER_STATE_PAID,
  ORDER_STATE_SENT,
} from "@bsport/common/lib/master-data/order-states";
import type { ChipProps } from "@bsport/kaizen-primitive-core";

import type { OrderStatus } from "#src/utils/constants";

export const ORDER_STATE_TO_COLOR: Record<number, ChipProps["color"]> = {
  [ORDER_STATE_CANCELLED.id]: "critical",
  [ORDER_STATE_ONSITEDELIVERY.id]: "info",
  [ORDER_STATE_PAID.id]: "default",
  [ORDER_STATE_SENT.id]: "main",
  [ORDER_STATE_INITIALIZED.id]: "default",
};

/** Fallback color if an order status does not have an explicit mapping */
export const DEFAULT_ORDER_STATE_COLOR: ChipProps["color"] = "default";

export type TableRowData = {
  id: string;
  dateUpdated: Date;
  dateCreated: Date;
  memberPhotoSrc?: string;
  memberInitials: string;
  memberName: string;
  orderStatus: OrderStatus;
  orderQuantity: number;
  orderTotal: number;
};
