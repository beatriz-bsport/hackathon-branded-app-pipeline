import type {
  CreateNotesFilterPayload,
  NotesFilter,
} from "@bsport/api-cdp/smartlist";

import type { SubFilterModule } from "#src/components/filters/shared/sub-filter-contract";

import type {
  InternalNotesFilterDirtyPatchPayload,
  InternalNotesFilterFormValue,
} from "../types";
import type { InternalNotesSubFilterId } from "./internal-notes-sub-filter-id";
import type { InternalNotesSubFilterSectionProps } from "./internal-notes-sub-filter-section-props";

/**
 * Contract every internal-notes sub-filter module must implement.
 */
export type InternalNotesSubFilterModule = SubFilterModule<
  InternalNotesSubFilterId,
  InternalNotesFilterFormValue,
  NotesFilter,
  CreateNotesFilterPayload,
  InternalNotesFilterDirtyPatchPayload,
  InternalNotesSubFilterSectionProps
>;
