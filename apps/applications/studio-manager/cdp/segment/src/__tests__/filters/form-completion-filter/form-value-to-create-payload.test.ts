import { describe, expect, it } from "vitest";

import { CUSTOM_FORM_COMPLETION_CONDITION } from "@bsport/api-cdp/smartlist";

import { createDefaultFormCompletionFilter } from "#src/components/filters/form-completion-filter/default-value";
import { toCreatePayload } from "#src/components/filters/form-completion-filter/mappers/form-value-to-create-payload";

describe("toCreatePayload", () => {
  it("always sends is_v2 true with completion condition and custom forms", () => {
    const value = {
      ...createDefaultFormCompletionFilter(123),
      all_selected_must_fulfill_condition_v2:
        CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS,
      custom_forms: [10, 11],
    };

    const payload = toCreatePayload(value);

    expect(payload).toEqual({
      smartlist: 123,
      is_v2: true,
      all_selected_must_fulfill_condition_v2:
        CUSTOM_FORM_COMPLETION_CONDITION.ALL_FORMS,
      custom_forms: [10, 11],
    });
  });
});
