import { z } from "zod";

import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import {
  ACTIVE_PASSES_COMPARATOR_TYPE,
  MIN_ACTIVE_PASSES_COMPARATOR_VALUE,
} from "./constants";
import type { ActivePassesFilterFormValue } from "./types";

const selectorSchema = z.object({
  enabled: z.boolean(),
  selectAll: z.boolean(),
  selectedIds: z.array(z.number()),
});

const activePassesFilterBaseSchema = z.object({
  id: z.number().int().positive().optional(),
  smartlist: z.number().int().positive(),
  comparatorType: z.enum([
    ACTIVE_PASSES_COMPARATOR_TYPE.between,
    ACTIVE_PASSES_COMPARATOR_TYPE.lowerOrEqual,
    ACTIVE_PASSES_COMPARATOR_TYPE.greaterOrEqual,
    ACTIVE_PASSES_COMPARATOR_TYPE.equal,
  ]),
  comparatorValue: z
    .number()
    .int()
    .min(
      MIN_ACTIVE_PASSES_COMPARATOR_VALUE,
      i18nInstance.t("filters.27.validation.minCountValue", {
        ns: I18N_SEGMENT_NAMESPACES.FILTERS,
      }),
    ),
  comparatorValueSecond: z
    .number()
    .int()
    .min(
      MIN_ACTIVE_PASSES_COMPARATOR_VALUE,
      i18nInstance.t("filters.27.validation.minCountValue", {
        ns: I18N_SEGMENT_NAMESPACES.FILTERS,
      }),
    )
    .nullable(),
  paymentPacksSelector: selectorSchema,
  appointmentPassesSelector: selectorSchema,
});

/**
 * Zod schema for validating the active passes filter form before create / update.
 *
 * Validation rules:
 * - At least one pass type section must be enabled.
 * - An enabled section must have `selectAll = true` OR at least one specific id
 *   selected. An enabled section with `selectAll = false` and empty `selectedIds`
 *   is always an error — it is NOT treated as "all passes".
 * - "Select all" is only set when the user explicitly clicks the "Select all"
 *   option in the picker; the mapper detects this by checking `selectAll = true`.
 */
export const activePassesFilterSchema =
  activePassesFilterBaseSchema.superRefine((data, context) => {
    if (
      !data.paymentPacksSelector.enabled &&
      !data.appointmentPassesSelector.enabled
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentPacksSelector", "enabled"],
        message: i18nInstance.t(
          "filters.27.validation.atLeastOneSectionRequired",
          { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
        ),
      });
    }

    if (
      data.paymentPacksSelector.enabled &&
      !data.paymentPacksSelector.selectAll &&
      data.paymentPacksSelector.selectedIds.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentPacksSelector", "selectedIds"],
        message: i18nInstance.t(
          "filters.27.validation.atLeastOnePassSelectedRequired",
          { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
        ),
      });
    }

    if (
      data.appointmentPassesSelector.enabled &&
      !data.appointmentPassesSelector.selectAll &&
      data.appointmentPassesSelector.selectedIds.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["appointmentPassesSelector", "selectedIds"],
        message: i18nInstance.t(
          "filters.27.validation.atLeastOneAppointmentPassSelectedRequired",
          { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
        ),
      });
    }

    if (data.comparatorType !== ACTIVE_PASSES_COMPARATOR_TYPE.between) {
      return;
    }

    if (data.comparatorValueSecond === null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["comparatorValueSecond"],
        message: i18nInstance.t("filters.27.validation.secondValueRequired", {
          ns: I18N_SEGMENT_NAMESPACES.FILTERS,
        }),
      });
      return;
    }

    if (data.comparatorValueSecond < data.comparatorValue) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["comparatorValueSecond"],
        message: i18nInstance.t(
          "filters.27.validation.secondValueGreaterThanFirst",
          { ns: I18N_SEGMENT_NAMESPACES.FILTERS },
        ),
      });
    }
  }) satisfies z.ZodType<ActivePassesFilterFormValue>;
