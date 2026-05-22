import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { ACTIVE_PASSES_COMPARATOR_TYPE } from "./constants";
import type { ActivePassesFilterFormValue } from "./types";

const I18N_NAMESPACE = "sm-smartlists_filters";

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
  comparatorValue: z.number().int().nonnegative(),
  comparatorValueSecond: z.number().int().nonnegative().nullable(),
  paymentPacksSelector: selectorSchema,
  privatePassesSelector: selectorSchema,
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
      !data.privatePassesSelector.enabled
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentPacksSelector", "enabled"],
        message: i18nInstance.t(
          "filters.27.validation.atLeastOneSectionRequired",
          { ns: I18N_NAMESPACE },
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
          { ns: I18N_NAMESPACE },
        ),
      });
    }

    if (
      data.privatePassesSelector.enabled &&
      !data.privatePassesSelector.selectAll &&
      data.privatePassesSelector.selectedIds.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["privatePassesSelector", "selectedIds"],
        message: i18nInstance.t(
          "filters.27.validation.atLeastOneAppointmentPassSelectedRequired",
          { ns: I18N_NAMESPACE },
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
          ns: I18N_NAMESPACE,
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
          { ns: I18N_NAMESPACE },
        ),
      });
    }
  }) satisfies z.ZodType<ActivePassesFilterFormValue>;
