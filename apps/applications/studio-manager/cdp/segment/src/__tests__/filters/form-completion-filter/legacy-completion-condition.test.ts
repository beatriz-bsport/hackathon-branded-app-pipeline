import { describe, expect, it } from "vitest";

import {
  CUSTOM_FORM_COMPLETION_CONDITION,
  type CustomFormFilter,
} from "@bsport/api-cdp/smartlist";

import {
  hadLegacyConfigurationAtFetch,
  isV1CompletionFilter,
  mapV1CompletionConditionToV2,
} from "#src/components/filters/form-completion-filter/utils/legacy-completion-condition";

const buildCustomFormFilter = (
  overrides: Partial<CustomFormFilter> = {},
): CustomFormFilter => ({
  id: 601,
  company: 7,
  smartlist: 123,
  filter_identifier: 102,
  is_v2: true,
  all_selected_must_fulfill_condition_v2:
    CUSTOM_FORM_COMPLETION_CONDITION.AT_LEAST_ONE_FORM,
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

describe("mapV1CompletionConditionToV2", () => {
  it("maps at-least-one v1 booleans", () => {
    const filter = buildCustomFormFilter({
      is_v2: false,
      has_filled: true,
      all_selected_must_fulfill_condition: false,
    });

    expect(mapV1CompletionConditionToV2(filter)).toBe(
      CUSTOM_FORM_COMPLETION_CONDITION.AT_LEAST_ONE_FORM,
    );
  });

  it("maps all-forms v1 booleans", () => {
    const filter = buildCustomFormFilter({
      is_v2: false,
      has_filled: true,
      all_selected_must_fulfill_condition: true,
    });

    expect(mapV1CompletionConditionToV2(filter)).toBe(
      CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS,
    );
  });

  it("maps no-form v1 booleans", () => {
    const filter = buildCustomFormFilter({
      is_v2: false,
      has_filled: false,
      all_selected_must_fulfill_condition: true,
    });

    expect(mapV1CompletionConditionToV2(filter)).toBe(
      CUSTOM_FORM_COMPLETION_CONDITION.NO_FORM,
    );
  });

  it("defaults unmappable v1 booleans to at least one", () => {
    const filter = buildCustomFormFilter({
      is_v2: false,
      has_filled: false,
      all_selected_must_fulfill_condition: false,
    });

    expect(mapV1CompletionConditionToV2(filter)).toBe(
      CUSTOM_FORM_COMPLETION_CONDITION.AT_LEAST_ONE_FORM,
    );
  });
});

describe("legacy configuration flags", () => {
  it("detects v1 rows", () => {
    const filter = buildCustomFormFilter({ is_v2: false });

    expect(isV1CompletionFilter(filter)).toBe(true);
    expect(hadLegacyConfigurationAtFetch(filter)).toBe(true);
  });

  it("does not flag clean v2 rows", () => {
    const filter = buildCustomFormFilter();

    expect(isV1CompletionFilter(filter)).toBe(false);
    expect(hadLegacyConfigurationAtFetch(filter)).toBe(false);
  });
});
