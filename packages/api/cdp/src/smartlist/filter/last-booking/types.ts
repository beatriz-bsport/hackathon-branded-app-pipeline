import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Smartlist last booking filter (filter identifier 501).
 * Endpoint family: `/customer-data-platform/v1/smartlist/last_booking/`
 */
export type LastBookingFilter = SmartlistFilterPayload & {
  company_id: number;
  value: number;
};

export type CreateLastBookingFilterPayload = Pick<
  LastBookingFilter,
  "smartlist" | "value"
>;

export type UpdateLastBookingFilterPayload = Partial<
  Pick<LastBookingFilter, "value">
>;
