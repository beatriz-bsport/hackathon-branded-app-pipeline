import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

import { NOTE_TYPE_OPTIONS } from "./constants";
import type { InternalNotesFilterFormValue } from "./types";

/**
 * Returns the default UI state for a brand-new internal notes filter card.
 *
 * Matches backend model defaults: `note_condition: 0` (Both), date sub-filter off.
 *
 * @param smartlistId - Identifier of the smartlist this filter belongs to.
 */
export const createDefaultInternalNotesFilter = (
  smartlistId: number,
): InternalNotesFilterFormValue => ({
  smartlist: smartlistId,
  noteType: NOTE_TYPE_OPTIONS.both,
  subFilters: [],
  noteCreationDate: createDefaultDateFilterValue(),
});
