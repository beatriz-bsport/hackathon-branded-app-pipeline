import type { NotesFilter } from "@bsport/api-cdp/smartlist";

import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import { mapApiNoteConditionToNoteType } from "../constants";
import { REGISTERED_INTERNAL_NOTES_SUB_FILTERS } from "../sub-filters/registry";
import type { InternalNotesFilterFormValue } from "../types";

/**
 * Converts a server-side `NotesFilter` payload into the UI form value.
 */
export const mapInternalNotesFilterToFormValue = (
  filter: NotesFilter,
): InternalNotesFilterFormValue => {
  const subFilters: InternalNotesFilterFormValue["subFilters"] = [];
  const partialForm: Partial<InternalNotesFilterFormValue> = {};

  for (const subFilterModule of REGISTERED_INTERNAL_NOTES_SUB_FILTERS) {
    const readResult = subFilterModule.readFromApi(filter);
    if (readResult.isActive) {
      subFilters.push(subFilterModule.id);
    }
    Object.assign(partialForm, readResult.partial);
  }

  return {
    id: filter.id,
    smartlist: filter.smartlist,
    noteType: mapApiNoteConditionToNoteType(filter.note_condition),
    subFilters,
    noteCreationDate:
      partialForm.noteCreationDate ?? createDefaultDateFilterValue(),
  };
};
