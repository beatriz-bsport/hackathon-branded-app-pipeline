import { describe, expect, it, vi } from "vitest";

import { createDefaultInternalNotesFilter } from "#src/components/filters/internal-notes-filter/default-value";
import { internalNotesFilterSchema } from "#src/components/filters/internal-notes-filter/schema";
import { INTERNAL_NOTES_SUB_FILTER_IDS } from "#src/components/filters/internal-notes-filter/sub-filters/internal-notes-sub-filter-id";
import type { InternalNotesFilterFormValue } from "#src/components/filters/internal-notes-filter/types";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";
import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("createDefaultInternalNotesFilter", () => {
  it("returns independent noteCreationDate objects per call", () => {
    const firstFilter = createDefaultInternalNotesFilter(1);
    const secondFilter = createDefaultInternalNotesFilter(2);

    firstFilter.noteCreationDate.absolute.fromDate = "2024-01-15";

    expect(secondFilter.noteCreationDate.absolute.fromDate).toBeNull();
    expect(firstFilter.noteCreationDate).not.toBe(
      secondFilter.noteCreationDate,
    );
  });
});

describe("internalNotesFilterSchema", () => {
  it("accepts a valid default form value", () => {
    const formValue = createDefaultInternalNotesFilter(1);

    const result = internalNotesFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("rejects note creation date sub-filter without a date", () => {
    const formValue = createDefaultInternalNotesFilter(1);
    formValue.subFilters = [INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate];
    formValue.noteCreationDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: null,
        toDate: null,
      },
      relative: formValue.noteCreationDate.relative,
    };

    const result = internalNotesFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });

  it("accepts note creation date sub-filter with a valid exact date", () => {
    const formValue = createDefaultInternalNotesFilter(1);
    formValue.subFilters = [INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate];
    formValue.noteCreationDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: "2024-06-15",
        toDate: null,
      },
      relative: formValue.noteCreationDate.relative,
    };

    const result = internalNotesFilterSchema.safeParse(formValue);

    expect(result.success).toBe(true);
  });

  it("rejects between date range without both dates", () => {
    const formValue = createDefaultInternalNotesFilter(1);
    formValue.subFilters = [INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate];
    formValue.noteCreationDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.between,
        fromDate: "2024-06-01",
        toDate: null,
      },
      relative: formValue.noteCreationDate.relative,
    };

    const result = internalNotesFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });

  describe("note creation date sub-filter — relative operators", () => {
    const buildRelativeNoteCreationDateValue = (
      operator: (typeof RELATIVE_DATE_OPERATORS)[keyof typeof RELATIVE_DATE_OPERATORS],
      firstDays: number | null,
      secondDays: number | null,
    ): InternalNotesFilterFormValue => {
      const formValue = createDefaultInternalNotesFilter(1);
      formValue.subFilters = [INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate];
      formValue.noteCreationDate = {
        ...createDefaultDateFilterValue(),
        dateType: DATE_FILTER_TYPES.relative,
        relative: {
          operator,
          firstDays,
          secondDays,
        },
      };
      return formValue;
    };

    it.each([
      RELATIVE_DATE_OPERATORS.pastMoreThan,
      RELATIVE_DATE_OPERATORS.pastExactly,
      RELATIVE_DATE_OPERATORS.futureMoreThan,
      RELATIVE_DATE_OPERATORS.futureExactly,
    ])(
      "rejects single-value operator %s when firstDays is missing",
      (operator) => {
        const formValue = buildRelativeNoteCreationDateValue(
          operator,
          null,
          null,
        );

        const result = internalNotesFilterSchema.safeParse(formValue);

        expect(result.success).toBe(false);
        if (!result.success) {
          const issuePaths = result.error.issues.map((issue) => issue.path);
          expect(issuePaths).toContainEqual([
            "noteCreationDate",
            "relative",
            "firstDays",
          ]);
        }
      },
    );

    it.each([
      RELATIVE_DATE_OPERATORS.pastMoreThan,
      RELATIVE_DATE_OPERATORS.pastExactly,
      RELATIVE_DATE_OPERATORS.futureMoreThan,
      RELATIVE_DATE_OPERATORS.futureExactly,
    ])("accepts single-value operator %s when firstDays is set", (operator) => {
      const formValue = buildRelativeNoteCreationDateValue(operator, 30, null);

      const result = internalNotesFilterSchema.safeParse(formValue);

      expect(result.success).toBe(true);
    });

    it.each([
      RELATIVE_DATE_OPERATORS.pastBetween,
      RELATIVE_DATE_OPERATORS.futureBetween,
    ])("rejects between operator %s when secondDays is missing", (operator) => {
      const formValue = buildRelativeNoteCreationDateValue(operator, 10, null);

      const result = internalNotesFilterSchema.safeParse(formValue);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issuePaths = result.error.issues.map((issue) => issue.path);
        expect(issuePaths).toContainEqual([
          "noteCreationDate",
          "relative",
          "secondDays",
        ]);
      }
    });

    it.each([
      RELATIVE_DATE_OPERATORS.pastBetween,
      RELATIVE_DATE_OPERATORS.futureBetween,
    ])("rejects between operator %s when firstDays is missing", (operator) => {
      const formValue = buildRelativeNoteCreationDateValue(operator, null, 10);

      const result = internalNotesFilterSchema.safeParse(formValue);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issuePaths = result.error.issues.map((issue) => issue.path);
        expect(issuePaths).toContainEqual([
          "noteCreationDate",
          "relative",
          "firstDays",
        ]);
      }
    });

    it.each([
      RELATIVE_DATE_OPERATORS.pastBetween,
      RELATIVE_DATE_OPERATORS.futureBetween,
    ])(
      "accepts between operator %s when both firstDays and secondDays are set",
      (operator) => {
        const formValue = buildRelativeNoteCreationDateValue(operator, 10, 30);

        const result = internalNotesFilterSchema.safeParse(formValue);

        expect(result.success).toBe(true);
      },
    );
  });
});
