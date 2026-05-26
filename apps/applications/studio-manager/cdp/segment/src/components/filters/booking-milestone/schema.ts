import { z } from "zod";

import { BOOKING_MILESTONE_MIN_VALUE } from "#src/components/filters/booking-milestone/constants";
import type { BookingMilestoneFilterFormValue } from "#src/components/filters/booking-milestone/types";
import { totalBookingNumberFilterSchema } from "#src/components/filters/total-booking/schema";
import { i18nInstance } from "#src/utils/i18n";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Schema for the booking milestone (filter 21) form. Inherits all sub-filter
 * refinements from the total-booking schema (since the slices are identical),
 * and replaces the comparator validation with a strict positive-integer rule
 * on `value`.
 */
export const bookingMilestoneFilterSchema =
  totalBookingNumberFilterSchema.superRefine((data, context) => {
    if (!Number.isInteger(data.value)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: i18nInstance.t("filters.21.validation.valueMustBeInteger", {
          ns: I18N_NAMESPACE,
        }),
      });
      return;
    }

    if (data.value < BOOKING_MILESTONE_MIN_VALUE) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: i18nInstance.t("filters.21.validation.valueRequired", {
          ns: I18N_NAMESPACE,
        }),
      });
    }
  }) satisfies z.ZodType<BookingMilestoneFilterFormValue>;
