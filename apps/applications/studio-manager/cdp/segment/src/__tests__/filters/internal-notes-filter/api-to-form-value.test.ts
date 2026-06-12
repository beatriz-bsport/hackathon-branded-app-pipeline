import { describe, expect, it } from "vitest";

import {
  NOTES_FILTER_IDENTIFIER,
  NoteCondition,
  type NotesFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { NOTE_TYPE_OPTIONS } from "#src/components/filters/internal-notes-filter/constants";
import { mapInternalNotesFilterToFormValue } from "#src/components/filters/internal-notes-filter/mappers/api-to-form-value";
import { INTERNAL_NOTES_SUB_FILTER_IDS } from "#src/components/filters/internal-notes-filter/sub-filters/internal-notes-sub-filter-id";

const buildApiFilter = (overrides: Partial<NotesFilter> = {}): NotesFilter => ({
  id: 1,
  company: 1,
  smartlist: 1,
  filter_identifier: Number(NOTES_FILTER_IDENTIFIER),
  note_condition: NoteCondition.ANY_NOTE,
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_BEFORE,
  date: "2024-06-15",
  date_second: "2024-06-15",
  duration: 0,
  duration_second: 0,
  ...overrides,
});

describe("mapInternalNotesFilterToFormValue", () => {
  it("maps note_condition 0 to both", () => {
    const filter = buildApiFilter({ note_condition: NoteCondition.ANY_NOTE });

    const formValue = mapInternalNotesFilterToFormValue(filter);

    expect(formValue.noteType).toBe(NOTE_TYPE_OPTIONS.both);
  });

  it("maps note_condition 1 to medical", () => {
    const filter = buildApiFilter({
      note_condition: NoteCondition.MEDICAL_NOTE,
    });

    const formValue = mapInternalNotesFilterToFormValue(filter);

    expect(formValue.noteType).toBe(NOTE_TYPE_OPTIONS.medical);
  });

  it("maps note_condition 2 to essential non-medical", () => {
    const filter = buildApiFilter({
      note_condition: NoteCondition.NON_MEDICAL_NOTE,
    });

    const formValue = mapInternalNotesFilterToFormValue(filter);

    expect(formValue.noteType).toBe(NOTE_TYPE_OPTIONS.essentialNonMedical);
  });

  it("maps legacy null note_condition to both", () => {
    const filter = buildApiFilter({ note_condition: null });

    const formValue = mapInternalNotesFilterToFormValue(filter);

    expect(formValue.noteType).toBe(NOTE_TYPE_OPTIONS.both);
  });

  it("activates note creation date sub-filter when date_filter_active is true", () => {
    const filter = buildApiFilter({
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DATE_EXACT,
      date: "2024-06-15",
    });

    const formValue = mapInternalNotesFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual([
      INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate,
    ]);
    expect(formValue.noteCreationDate.absolute.fromDate).toBe("2024-06-15");
  });

  it("preserves the smartlist id and the filter id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapInternalNotesFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });
});
