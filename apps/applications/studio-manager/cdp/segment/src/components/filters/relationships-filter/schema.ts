import { z } from "zod";

import { SMARTLIST_RELATIONS_COMPARATOR } from "@bsport/api-cdp/smartlist";

import { I18N_SEGMENT_NAMESPACES } from "#src/i18n";
import { i18nInstance } from "#src/utils/i18n";

import type { RelationshipsFilterFormValue } from "./types";

const relationshipsComparatorSchema = z.union([
  z.literal(SMARTLIST_RELATIONS_COMPARATOR.LTE),
  z.literal(SMARTLIST_RELATIONS_COMPARATOR.GTE),
  z.literal(SMARTLIST_RELATIONS_COMPARATOR.EQUAL),
  z.literal(SMARTLIST_RELATIONS_COMPARATOR.BETWEEN),
]);

export const relationshipsFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    comparator_number_relations: relationshipsComparatorSchema,
    value_number_relations: z.number().int().min(0),
    value_number_relations_second: z.number().int().min(0),
    hadDeprecatedSubFiltersAtFetch: z.boolean().optional(),
  })
  .superRefine((data, context) => {
    if (
      data.comparator_number_relations !==
      SMARTLIST_RELATIONS_COMPARATOR.BETWEEN
    ) {
      return;
    }

    if (data.value_number_relations_second < data.value_number_relations) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value_number_relations_second"],
        message: i18nInstance.t(
          "filters.105.validation.valueSecondGreaterThanFirst",
          {
            ns: I18N_SEGMENT_NAMESPACES.FILTERS,
          },
        ),
      });
    }
  }) satisfies z.ZodType<RelationshipsFilterFormValue>;
