import { describe, expect, it } from "vitest";

import { type CustomFormFilter } from "@bsport/api-cdp/smartlist";

import {
  buildDeactivateDeprecatedSubFiltersPatch,
  hasActiveDeprecatedSubFilters,
} from "#src/components/filters/form-completion-filter/utils/deprecated-sub-filters";

const CUSTOM_FORM_FILTER_IDENTIFIER = 102;

const buildCustomFormFilter = (
  overrides: Partial<CustomFormFilter> = {},
): CustomFormFilter => ({
  id: 601,
  company: 7,
  smartlist: 123,
  filter_identifier: CUSTOM_FORM_FILTER_IDENTIFIER,
  is_v2: true,
  all_selected_must_fulfill_condition_v2: 2,
  custom_forms: [10, 11],
  has_filled: true,
  all_selected_must_fulfill_condition: false,
  date_filter_active: false,
  date_filter_type: 3,
  date: "2026-06-19",
  date_second: "2026-06-19",
  duration: 0,
  duration_second: 0,
  completion_percentage_filter_active: false,
  completion_percentage_comparator: 2,
  completion_percentage_value: 0,
  completion_percentage_value_second: 100,
  ...overrides,
});

describe("deprecated sub-filters", () => {
  it("detects active completion percentage sub-filter", () => {
    const filter = buildCustomFormFilter({
      completion_percentage_filter_active: true,
    });

    expect(hasActiveDeprecatedSubFilters(filter)).toBe(true);
    expect(buildDeactivateDeprecatedSubFiltersPatch()).toEqual({
      date_filter_active: false,
      completion_percentage_filter_active: false,
    });
  });
});
