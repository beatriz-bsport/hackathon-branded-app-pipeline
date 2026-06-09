import { z } from "zod";

import { dateFilterValueSchema } from "#src/components/filters/shared/smartlist-date-filter/schema";

import { NOTE_TYPE_OPTIONS } from "./constants";
import { INTERNAL_NOTES_SUB_FILTER_IDS } from "./sub-filters/internal-notes-sub-filter-id";
import { REGISTERED_INTERNAL_NOTES_SUB_FILTERS } from "./sub-filters/registry";
import type { InternalNotesFilterFormValue } from "./types";

const subFilterIdSchema = z.array(
  z.literal(INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate),
);

/**
 * Validation schema for the internal notes filter (base fields + registered sub-filters).
 */
export const internalNotesFilterSchema = z
  .object({
    id: z.number().int().positive().optional(),
    smartlist: z.number().int().positive(),
    noteType: z.enum([
      NOTE_TYPE_OPTIONS.essentialNonMedical,
      NOTE_TYPE_OPTIONS.medical,
      NOTE_TYPE_OPTIONS.both,
    ]),
    subFilters: subFilterIdSchema,
    noteCreationDate: dateFilterValueSchema,
  })
  .superRefine((value, context) => {
    for (const subFilterModule of REGISTERED_INTERNAL_NOTES_SUB_FILTERS) {
      subFilterModule.refine(value, context);
    }
  }) satisfies z.ZodType<InternalNotesFilterFormValue>;
