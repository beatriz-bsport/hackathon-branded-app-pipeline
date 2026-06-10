import type {
  CreateNotesFilterPayload,
  NotesFilter,
  UpdateNotesFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { DateFilterValue } from "#src/components/primitive-filters/date-filter/types";

import type { NoteTypeOption } from "./constants";
import type { InternalNotesSubFilterId } from "./sub-filters/internal-notes-sub-filter-id";

export type InternalNotesFilterFormValue = {
  id?: number;
  smartlist: number;
  noteType: NoteTypeOption;
  subFilters: InternalNotesSubFilterId[];
  noteCreationDate: DateFilterValue;
};

export type InternalNotesFilterCardProps = {
  smartlistId: string;
  filterValue: InternalNotesFilterFormValue;
  onDeleteUnsavedFilter?: () => void;
  onSaveSuccess?: () => void;
};

export type InternalNotesFilterCreatePayload = CreateNotesFilterPayload;
export type InternalNotesFilterDirtyPatchPayload = UpdateNotesFilterPayload;

export type { NotesFilter };
