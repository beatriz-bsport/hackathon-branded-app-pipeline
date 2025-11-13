import type { ChipProps } from "@bsport/kaizen-primitive-core";
import type { Order } from "@bsport/store-buyables-order";

import {
  ORDER_STATUS_TO_I18N_KEY,
  type OrderStatus,
} from "#src/utils/constants";
import type { TFunction } from "#src/utils/i18n";

import { DEFAULT_ORDER_STATE_COLOR, ORDER_STATE_TO_COLOR } from "./constants";

/**
 * Transforms an Order's first and last name into initials
 * @example getMemberInitials({ first_name: "John", last_name: "Doe" }) => "JD"
 */
export const getMemberInitials = (order: Order): string => {
  return `${order.first_name?.[0] ?? ""}${order.last_name?.[0] ?? ""}`.toUpperCase();
};

/**
 * Formats an Order's member name, including archived status if applicable
 * @param order - The order object
 * @param archivedText - Localized text for "archived" status
 * @example getMemberName(order, "archived") => "John Doe (archived)"
 */
export const getMemberName = (order: Order, archivedText: string): string => {
  return [
    order?.first_name,
    order?.last_name,
    order.member_archived ? `(${archivedText})` : undefined,
  ]
    .filter((name) => !!name)
    .join(" ");
};

/**
 * Returns the chip configuration for an order status
 * Includes color mapping and localized label
 * @param orderStatus - The order status to format
 * @param t - i18next translation function
 * @returns Object with color and label properties for the Chip component
 */
export const getOrderStatusChipConfig = (
  orderStatus: OrderStatus,
  t: TFunction,
): { color: ChipProps["color"]; label: string } => {
  const color = ORDER_STATE_TO_COLOR[orderStatus] ?? DEFAULT_ORDER_STATE_COLOR;

  const label = ORDER_STATUS_TO_I18N_KEY[orderStatus]
    ? t(`status.values.${ORDER_STATUS_TO_I18N_KEY[orderStatus]}`, {
        ns: "common",
      })
    : `${orderStatus}`;

  return { color, label };
};
