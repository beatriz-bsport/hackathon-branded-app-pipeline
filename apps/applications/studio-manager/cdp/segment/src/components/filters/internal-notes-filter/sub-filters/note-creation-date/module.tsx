import {
  type CreateNotesFilterPayload,
  type NotesFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { hasNestedDirty } from "#src/components/filters/shared/dirty-fields";
import {
  getDefaultApiDate,
  mapDateFilterType,
  toApiDateSection,
  toFormDateSection,
} from "#src/components/filters/shared/smartlist-date-filter/smartlist-date-utils";

import type { InternalNotesFilterFormValue } from "../../types";
import { INTERNAL_NOTES_SUB_FILTER_IDS } from "../internal-notes-sub-filter-id";
import type { InternalNotesSubFilterModule } from "../internal-notes-sub-filter-module-contract";
import { NoteCreationDateSubFilterSection } from "./component";
import { refineNoteCreationDateSubFilter } from "./schema";

const NOTE_CREATION_DATE_INACTIVE_API_SLICE: Partial<CreateNotesFilterPayload> =
  {
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_BEFORE,
    date: getDefaultApiDate(),
    date_second: getDefaultApiDate(),
    duration: 0,
    duration_second: 0,
  };

const toNoteCreationDateApiSlice = (
  value: InternalNotesFilterFormValue,
): Partial<CreateNotesFilterPayload> => {
  if (
    !value.subFilters.includes(INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate)
  ) {
    return NOTE_CREATION_DATE_INACTIVE_API_SLICE;
  }

  const dateFilterType = mapDateFilterType(value.noteCreationDate);
  const dateSection = toApiDateSection(value.noteCreationDate, dateFilterType);

  return {
    date_filter_active: true,
    date_filter_type: dateFilterType,
    date: dateSection.fromDate,
    date_second: dateSection.toDate,
    duration: dateSection.firstDurationValue,
    duration_second: dateSection.secondDurationValue,
  };
};

export const noteCreationDateInternalNotesSubFilterModule: InternalNotesSubFilterModule =
  {
    id: INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate,
    labelKey: "filters.104.subFilters.noteCreationDate",
    Section: NoteCreationDateSubFilterSection,
    refine: refineNoteCreationDateSubFilter,
    readFromApi: (filter: NotesFilter) => ({
      isActive: filter.date_filter_active === true,
      partial: {
        noteCreationDate: toFormDateSection(
          filter.date_filter_type,
          filter.date,
          filter.date_second,
          filter.duration,
          filter.duration_second,
        ),
      },
    }),
    appendCreatePayloadSlice: (value) => toNoteCreationDateApiSlice(value),
    appendDirtyPatchSlice: (dirtyFields, value) => {
      const subFiltersDirty = hasNestedDirty(dirtyFields.subFilters);
      const noteCreationDateDirty = hasNestedDirty(
        dirtyFields.noteCreationDate,
      );
      const subFiltersTouched = dirtyFields.subFilters !== undefined;
      if (!subFiltersDirty && !noteCreationDateDirty && !subFiltersTouched) {
        return {};
      }
      return toNoteCreationDateApiSlice(value);
    },
  };
