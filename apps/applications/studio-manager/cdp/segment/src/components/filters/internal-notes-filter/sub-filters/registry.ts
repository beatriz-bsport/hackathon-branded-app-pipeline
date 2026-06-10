import type { InternalNotesSubFilterId } from "./internal-notes-sub-filter-id";
import type { InternalNotesSubFilterModule } from "./internal-notes-sub-filter-module-contract";
import { noteCreationDateInternalNotesSubFilterModule } from "./note-creation-date/module";

/**
 * Ordered list of internal-notes sub-filter modules.
 */
export const REGISTERED_INTERNAL_NOTES_SUB_FILTERS: InternalNotesSubFilterModule[] =
  [noteCreationDateInternalNotesSubFilterModule];

export const REGISTERED_INTERNAL_NOTES_SUB_FILTERS_BY_ID =
  REGISTERED_INTERNAL_NOTES_SUB_FILTERS.reduce(
    (accumulator, subFilterModule) => {
      accumulator[subFilterModule.id] = subFilterModule;
      return accumulator;
    },
    {} as Record<InternalNotesSubFilterId, InternalNotesSubFilterModule>,
  );
