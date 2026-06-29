import { describe, expect, it } from "vitest";

import {
  NoteCondition,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { NOTE_TYPE_OPTIONS } from "#src/components/filters/internal-notes-filter/constants";
import { createDefaultInternalNotesFilter } from "#src/components/filters/internal-notes-filter/default-value";
import { createInternalNotesFilterPayload } from "#src/components/filters/internal-notes-filter/mappers/form-value-to-create-payload";
import { INTERNAL_NOTES_SUB_FILTER_IDS } from "#src/components/filters/internal-notes-filter/sub-filters/internal-notes-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";
import { getDefaultApiDate } from "#src/components/primitive-filters/date-filter/utils";

describe("createInternalNotesFilterPayload", () => {
  it("creates a minimal both-notes payload by default", () => {
    const value = createDefaultInternalNotesFilter(123);

    const payload = createInternalNotesFilterPayload(value);

    expect(payload).toMatchObject({
      smartlist: 123,
      note_condition: NoteCondition.ANY_NOTE,
      date_filter_active: false,
      date: getDefaultApiDate(),
      date_second: getDefaultApiDate(),
      date_filter_type: SmartlistDateFilterType.DATE_BEFORE,
      duration: 0,
      duration_second: 0,
    });
  });

  it("maps essential non-medical note type to API value 2", () => {
    const value = createDefaultInternalNotesFilter(1);
    value.noteType = NOTE_TYPE_OPTIONS.essentialNonMedical;

    const payload = createInternalNotesFilterPayload(value);

    expect(payload.note_condition).toBe(NoteCondition.NON_MEDICAL_NOTE);
  });

  it("maps medical note type to API value 1", () => {
    const value = createDefaultInternalNotesFilter(1);
    value.noteType = NOTE_TYPE_OPTIONS.medical;

    const payload = createInternalNotesFilterPayload(value);

    expect(payload.note_condition).toBe(NoteCondition.MEDICAL_NOTE);
  });

  it("activates date filter fields when note creation date sub-filter is selected", () => {
    const value = createDefaultInternalNotesFilter(1);
    value.subFilters = [INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate];
    value.noteCreationDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.between,
        fromDate: "2024-03-01",
        toDate: "2024-03-31",
      },
      relative: value.noteCreationDate.relative,
    };

    const payload = createInternalNotesFilterPayload(value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_BETWEEN);
    expect(payload.date).toBe("2024-03-01");
    expect(payload.date_second).toBe("2024-03-31");
  });
});
