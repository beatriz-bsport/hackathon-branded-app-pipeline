import { describe, expect, it } from "vitest";

import {
  CUSTOM_FORM_COMPLETION_CONDITION,
  type CustomFormFilter,
} from "@bsport/api-cdp/smartlist";

import { mapFormCompletionFilterToFormValue } from "#src/components/filters/form-completion-filter/mappers/api-to-form-value";

const CUSTOM_FORM_FILTER_IDENTIFIER = 102;

const buildCustomFormFilter = (
  overrides: Partial<CustomFormFilter> = {},
): CustomFormFilter => ({
  id: 601,
  company: 7,
  smartlist: 123,
  filter_identifier: CUSTOM_FORM_FILTER_IDENTIFIER,
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

describe("mapFormCompletionFilterToFormValue", () => {
  it("maps v2 completion condition and custom forms", () => {
    const filter = buildCustomFormFilter({
      all_selected_must_fulfill_condition_v2:
        CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS,
      custom_forms: [10, 11, 15],
    });

    const form = mapFormCompletionFilterToFormValue(filter);

    expect(form.all_selected_must_fulfill_condition_v2).toBe(
      CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS,
    );
    expect(form.custom_forms).toEqual([10, 11, 15]);
    expect(form.hadDeprecatedSubFiltersAtFetch).toBe(false);
  });

  it("maps v1 booleans to v2 completion condition", () => {
    const filter = buildCustomFormFilter({
      is_v2: false,
      has_filled: false,
      all_selected_must_fulfill_condition: true,
    });

    const form = mapFormCompletionFilterToFormValue(filter);

    expect(form.all_selected_must_fulfill_condition_v2).toBe(
      CUSTOM_FORM_COMPLETION_CONDITION.NO_FORM,
    );
    expect(form.hadLegacyConfigurationAtFetch).toBe(true);
  });

  it("passes through v2 completion condition unchanged", () => {
    const filter = buildCustomFormFilter({
      all_selected_must_fulfill_condition_v2:
        CUSTOM_FORM_COMPLETION_CONDITION.NO_FORM,
    });

    const form = mapFormCompletionFilterToFormValue(filter);

    expect(form.all_selected_must_fulfill_condition_v2).toBe(
      CUSTOM_FORM_COMPLETION_CONDITION.NO_FORM,
    );
    expect(form.hadDeprecatedSubFiltersAtFetch).toBe(false);
    expect(form.hadLegacyConfigurationAtFetch).toBe(false);
  });

  it("flags deprecated sub-filters when date filter is active", () => {
    const filter = buildCustomFormFilter({
      date_filter_active: true,
    });

    const form = mapFormCompletionFilterToFormValue(filter);

    expect(form.hadDeprecatedSubFiltersAtFetch).toBe(true);
    expect(form.hadLegacyConfigurationAtFetch).toBe(true);
  });
});
