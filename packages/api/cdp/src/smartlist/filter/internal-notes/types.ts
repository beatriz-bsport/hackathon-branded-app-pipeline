import type { SmartlistFilterPayload } from "../../shared/types";
import type { SmartlistDateFilterType } from "../../shared/types";
import type { NoteCondition } from "./constants";

/**
 * Smartlist internal notes filter (filter identifier 104).
 * Endpoint family: `/customer-data-platform/v1/smartlist/notes/`
 */
export type NotesFilter = SmartlistFilterPayload & {
  company: number;
  note_condition: NoteCondition | null;
  date_filter_active: boolean;
  date_filter_type: SmartlistDateFilterType;
  date: string;
  date_second: string;
  duration: number;
  duration_second: number;
};

export type CreateNotesFilterPayload = Pick<
  NotesFilter,
  | "smartlist"
  | "note_condition"
  | "date_filter_active"
  | "date_filter_type"
  | "date"
  | "date_second"
  | "duration"
  | "duration_second"
> & {
  note_condition: NoteCondition;
};

export type UpdateNotesFilterPayload = Partial<
  Omit<NotesFilter, "id" | "company" | "smartlist" | "filter_identifier">
>;
