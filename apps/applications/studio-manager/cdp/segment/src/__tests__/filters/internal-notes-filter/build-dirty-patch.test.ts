import { describe, expect, it } from "vitest";

import {
  NoteCondition,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { NOTE_TYPE_OPTIONS } from "#src/components/filters/internal-notes-filter/constants";
import { createDefaultInternalNotesFilter } from "#src/components/filters/internal-notes-filter/default-value";
import { buildInternalNotesFilterDirtyPatch } from "#src/components/filters/internal-notes-filter/mappers/build-dirty-patch";
import { INTERNAL_NOTES_SUB_FILTER_IDS } from "#src/components/filters/internal-notes-filter/sub-filters/internal-notes-sub-filter-id";
import type { InternalNotesFilterFormValue } from "#src/components/filters/internal-notes-filter/types";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
} from "#src/components/primitive-filters/date-filter/constants";

describe("buildInternalNotesFilterDirtyPatch", () => {
  it("includes note_condition when noteType is dirty", () => {
    const value = createDefaultInternalNotesFilter(1);
    value.noteType = NOTE_TYPE_OPTIONS.medical;

    const payload = buildInternalNotesFilterDirtyPatch(
      { noteType: true },
      value,
    );

    expect(payload).toEqual({ note_condition: NoteCondition.MEDICAL_NOTE });
  });

  it("includes date slice when note creation date sub-filter is dirty", () => {
    const value: InternalNotesFilterFormValue = {
      ...createDefaultInternalNotesFilter(1),
      subFilters: [INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate],
      noteCreationDate: {
        dateType: DATE_FILTER_TYPES.absolute,
        absolute: {
          operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
          fromDate: "2024-06-15",
          toDate: null,
        },
        relative: createDefaultInternalNotesFilter(1).noteCreationDate.relative,
      },
    };

    const payload = buildInternalNotesFilterDirtyPatch(
      { noteCreationDate: { absolute: { fromDate: true } } },
      value,
    );

    expect(payload).toMatchObject({
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DATE_EXACT,
      date: "2024-06-15",
    });
  });

  it("deactivates date filter when sub-filter is removed", () => {
    const value = createDefaultInternalNotesFilter(1);

    const payload = buildInternalNotesFilterDirtyPatch(
      { subFilters: [true] },
      value,
    );

    expect(payload).toMatchObject({
      date_filter_active: false,
    });
  });

  it("returns an empty payload when nothing is dirty", () => {
    const value = createDefaultInternalNotesFilter(1);

    const payload = buildInternalNotesFilterDirtyPatch({}, value);

    expect(payload).toEqual({});
  });
});
