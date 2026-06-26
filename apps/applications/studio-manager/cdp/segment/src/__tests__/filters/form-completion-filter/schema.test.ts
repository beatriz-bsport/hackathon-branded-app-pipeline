import { describe, expect, it, vi } from "vitest";

import { CUSTOM_FORM_COMPLETION_CONDITION } from "@bsport/api-cdp/smartlist";

import { createDefaultFormCompletionFilter } from "#src/components/filters/form-completion-filter/default-value";
import { formCompletionFilterSchema } from "#src/components/filters/form-completion-filter/schema";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("formCompletionFilterSchema", () => {
  it("accepts a valid filter with at least one custom form", () => {
    const value = {
      ...createDefaultFormCompletionFilter(123),
      custom_forms: [10],
    };

    const result = formCompletionFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects an empty custom forms selection", () => {
    const value = createDefaultFormCompletionFilter(123);

    const result = formCompletionFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts NO_FORM completion condition", () => {
    const value = {
      ...createDefaultFormCompletionFilter(123),
      all_selected_must_fulfill_condition_v2:
        CUSTOM_FORM_COMPLETION_CONDITION.NO_FORM,
      custom_forms: [10],
    };

    const result = formCompletionFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });
});
