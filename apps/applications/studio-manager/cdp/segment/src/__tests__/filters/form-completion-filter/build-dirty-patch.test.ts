import { describe, expect, it } from "vitest";

import { CUSTOM_FORM_COMPLETION_CONDITION } from "@bsport/api-cdp/smartlist";

import { createDefaultFormCompletionFilter } from "#src/components/filters/form-completion-filter/default-value";
import { buildFormCompletionFilterDirtyPatch } from "#src/components/filters/form-completion-filter/mappers/build-dirty-patch";

describe("buildFormCompletionFilterDirtyPatch", () => {
  it("returns an empty patch when nothing is dirty", () => {
    const value = {
      ...createDefaultFormCompletionFilter(123),
      id: 601,
      custom_forms: [10],
    };

    const patch = buildFormCompletionFilterDirtyPatch({}, value);

    expect(patch).toEqual({});
  });

  it("includes is_v2 when completion condition is dirty", () => {
    const value = {
      ...createDefaultFormCompletionFilter(123),
      id: 601,
      all_selected_must_fulfill_condition_v2:
        CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS,
      custom_forms: [10],
    };

    const patch = buildFormCompletionFilterDirtyPatch(
      { all_selected_must_fulfill_condition_v2: true },
      value,
    );

    expect(patch).toEqual({
      is_v2: true,
      all_selected_must_fulfill_condition_v2:
        CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS,
    });
  });

  it("sends the full custom_forms array when selection is dirty", () => {
    const value = {
      ...createDefaultFormCompletionFilter(123),
      id: 601,
      custom_forms: [10, 11, 15],
    };

    const patch = buildFormCompletionFilterDirtyPatch(
      { custom_forms: [true] },
      value,
    );

    expect(patch).toEqual({
      custom_forms: [10, 11, 15],
    });
  });
});
