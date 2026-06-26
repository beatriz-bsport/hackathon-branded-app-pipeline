import { z } from "zod";

import { CUSTOM_FORM_COMPLETION_CONDITION } from "@bsport/api-cdp/smartlist";

import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { FormCompletionFilterFormValue } from "./types";

const studioCompletionConditionSchema = z.union([
  z.literal(CUSTOM_FORM_COMPLETION_CONDITION.NO_FORM),
  z.literal(CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS),
  z.literal(CUSTOM_FORM_COMPLETION_CONDITION.AT_LEAST_ONE_FORM),
]);

export const formCompletionFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    all_selected_must_fulfill_condition_v2: studioCompletionConditionSchema,
    custom_forms: z.array(z.number().int().positive()),
    hadLegacyConfigurationAtFetch: z.boolean().optional(),
    hadDeprecatedSubFiltersAtFetch: z.boolean().optional(),
  })
  .superRefine((data, context) => {
    if (data.custom_forms.length >= 1) {
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["custom_forms"],
      message: i18nInstance.t("filters.102.validation.customFormsRequired", {
        ns: I18N_SEGMENT_NAMESPACES.FILTERS,
      }),
    });
  }) satisfies z.ZodType<FormCompletionFilterFormValue>;
