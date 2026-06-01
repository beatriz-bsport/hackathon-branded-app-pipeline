import { z } from "zod";

import { dateFilterValueSchema } from "#src/components/filters/passes-filter/sub-filters/purchase-date/schema";
import { i18nInstance } from "#src/utils/i18n";

import { TOTAL_APPOINTMENTS_NUMBER_TYPE } from "./constants";
import { REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS } from "./sub-filters/registry";
import { TOTAL_APPOINTMENTS_SUB_FILTER_IDS } from "./sub-filters/total-appointments-sub-filter-id";
import type { TotalAppointmentsNumberFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

const VALUE_REQUIRED_MESSAGE = i18nInstance.t(
  "filters.26.validation.valueRequired",
  { ns: I18N_NAMESPACE },
);

export const totalAppointmentsNumberFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    type: z.enum([
      TOTAL_APPOINTMENTS_NUMBER_TYPE.between,
      TOTAL_APPOINTMENTS_NUMBER_TYPE.lowerOrEqual,
      TOTAL_APPOINTMENTS_NUMBER_TYPE.greaterOrEqual,
      TOTAL_APPOINTMENTS_NUMBER_TYPE.equal,
    ]),
    value: z.number().int().min(0, VALUE_REQUIRED_MESSAGE),
    secondValue: z.number().int().min(0, VALUE_REQUIRED_MESSAGE).nullable(),
    subFilters: z.array(
      z.union([
        z.literal(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingDate),
        z.literal(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.bookingHourRange),
        z.literal(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.coach),
        z.literal(TOTAL_APPOINTMENTS_SUB_FILTER_IDS.establishment),
      ]),
    ),
    bookingDate: dateFilterValueSchema,
    bookingHourRange: z.object({
      hour: z.string(),
      hourSecond: z.string(),
    }),
    coach: z.object({
      selectAllCoaches: z.boolean(),
      selectedCoachIds: z.array(z.number().int().positive()),
    }),
    establishment: z.object({
      selectAllEstablishments: z.boolean(),
      selectedEstablishmentIds: z.array(z.number().int().positive()),
      atHome: z.boolean(),
    }),
  })
  .superRefine((data, context) => {
    if (data.type !== TOTAL_APPOINTMENTS_NUMBER_TYPE.between) {
      return;
    }

    if (data.secondValue === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["secondValue"],
        message: i18nInstance.t("filters.26.validation.secondValueRequired", {
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
          "filters.26.validation.secondValueGreaterThanFirst",
          {
            ns: I18N_NAMESPACE,
          },
        ),
      });
    }
  })
  .superRefine((value, context) => {
    for (const subFilterModule of REGISTERED_TOTAL_APPOINTMENTS_SUB_FILTERS) {
      subFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<TotalAppointmentsNumberFilterFormValue>;
