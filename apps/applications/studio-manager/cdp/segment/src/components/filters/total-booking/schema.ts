import { z } from "zod";

import { dateFilterValueSchema } from "#src/components/filters/shared/smartlist-date-filter/schema";
import { i18nInstance } from "#src/utils/i18n";

import { TOTAL_BOOKING_NUMBER_TYPE } from "./constants";
import { REGISTERED_TOTAL_BOOKING_SUB_FILTERS } from "./sub-filters/registry";
import { TOTAL_BOOKING_SUB_FILTER_IDS } from "./sub-filters/total-booking-sub-filter-id";
import type { TotalBookingNumberFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

export const totalBookingNumberFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    type: z.enum([
      TOTAL_BOOKING_NUMBER_TYPE.between,
      TOTAL_BOOKING_NUMBER_TYPE.lowerOrEqual,
      TOTAL_BOOKING_NUMBER_TYPE.greaterOrEqual,
      TOTAL_BOOKING_NUMBER_TYPE.equal,
    ]),
    value: z
      .number()
      .int()
      .min(
        0,
        i18nInstance.t("filters.22.validation.valueRequired", {
          ns: I18N_NAMESPACE,
        }),
      ),
    secondValue: z
      .number()
      .int()
      .min(
        0,
        i18nInstance.t("filters.22.validation.valueRequired", {
          ns: I18N_NAMESPACE,
        }),
      )
      .nullable(),
    subFilters: z.array(
      z.union([
        z.literal(TOTAL_BOOKING_SUB_FILTER_IDS.activity),
        z.literal(TOTAL_BOOKING_SUB_FILTER_IDS.attendanceMode),
        z.literal(TOTAL_BOOKING_SUB_FILTER_IDS.establishment),
        z.literal(TOTAL_BOOKING_SUB_FILTER_IDS.coach),
        z.literal(TOTAL_BOOKING_SUB_FILTER_IDS.paymentPack),
        z.literal(TOTAL_BOOKING_SUB_FILTER_IDS.bookingDate),
        z.literal(TOTAL_BOOKING_SUB_FILTER_IDS.bookingHourRange),
        z.literal(TOTAL_BOOKING_SUB_FILTER_IDS.level),
      ]),
    ),
    activity: z.object({
      selectAllActivities: z.boolean(),
      selectedMetaActivityIds: z.array(z.number().int().positive()),
    }),
    establishment: z.object({
      selectAllEstablishments: z.boolean(),
      selectedEstablishmentIds: z.array(z.number().int().positive()),
    }),
    coach: z.object({
      selectAllCoaches: z.boolean(),
      selectedCoachIds: z.array(z.number().int().positive()),
    }),
    paymentPack: z.object({
      selectAllPaymentPacks: z.boolean(),
      selectedPaymentPackIds: z.array(z.number().int().positive()),
    }),
    attendanceMode: z.object({
      attendance: z.boolean(),
    }),
    bookingDate: dateFilterValueSchema,
    bookingHourRange: z.object({
      hour: z.string(),
      hourSecond: z.string(),
    }),
    level: z.object({
      selectedLevelIds: z.array(z.number().int().positive()),
    }),
  })
  .superRefine((data, context) => {
    if (data.type !== TOTAL_BOOKING_NUMBER_TYPE.between) {
      return;
    }

    if (data.secondValue === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondValue"],
        message: i18nInstance.t("filters.22.validation.secondValueRequired", {
          ns: I18N_NAMESPACE,
        }),
      });
      return;
    }

    if (data.secondValue < data.value) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondValue"],
        message: i18nInstance.t(
          "filters.22.validation.secondValueGreaterThanFirst",
          {
            ns: I18N_NAMESPACE,
          },
        ),
      });
    }
  })
  .superRefine((value, context) => {
    for (const subFilterModule of REGISTERED_TOTAL_BOOKING_SUB_FILTERS) {
      subFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<TotalBookingNumberFilterFormValue>;
