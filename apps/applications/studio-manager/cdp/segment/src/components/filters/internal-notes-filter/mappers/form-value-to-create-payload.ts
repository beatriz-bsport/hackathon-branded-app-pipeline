import {
  type CreateNotesFilterPayload,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { getDefaultApiDate } from "#src/components/primitive-filters/date-filter/utils";

import { mapNoteTypeToApi } from "../constants";
import { REGISTERED_INTERNAL_NOTES_SUB_FILTERS } from "../sub-filters/registry";
import type { InternalNotesFilterFormValue } from "../types";

/**
 * Builds the `POST /notes/` payload from a form value.
 */
export const createInternalNotesFilterPayload = (
  value: InternalNotesFilterFormValue,
): CreateNotesFilterPayload => {
  const subFilterSlices = REGISTERED_INTERNAL_NOTES_SUB_FILTERS.reduce<
    Partial<CreateNotesFilterPayload>
  >(
    (accumulator, subFilterModule) => ({
      ...accumulator,
      ...subFilterModule.appendCreatePayloadSlice(value),
    }),
    {},
  );

  return {
    smartlist: value.smartlist,
    note_condition: mapNoteTypeToApi(value.noteType),
    date_filter_active: false,
    date_filter_type: SmartlistDateFilterType.DATE_BEFORE,
    date: getDefaultApiDate(),
    date_second: getDefaultApiDate(),
    duration: 0,
    duration_second: 0,
    ...subFilterSlices,
  };
};
