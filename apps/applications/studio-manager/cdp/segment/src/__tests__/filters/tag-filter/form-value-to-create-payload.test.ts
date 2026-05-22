import { describe, expect, it } from "vitest";

import { createDefaultTagFilterFormValue } from "#src/components/filters/tag-filter/default-value";
import { toCreatePayload } from "#src/components/filters/tag-filter/mappers/form-value-to-create-payload";

describe("toCreatePayload", () => {
  it("sends empty included list when include section is disabled", () => {
    const value = createDefaultTagFilterFormValue(5);
    value.includeSectionEnabled = false;
    value.excludeSectionEnabled = true;
    value.tagsExcluded = [9, 9, 8];

    const payload = toCreatePayload(value);

    expect(payload.smartlist).toBe(5);
    expect(payload.tags_included).toEqual([]);
    expect(payload.tags_excluded).toEqual([8, 9]);
  });

  it("dedupes and sorts included tag ids when enabled", () => {
    const value = createDefaultTagFilterFormValue(3);
    value.includeSectionEnabled = true;
    value.tagsIncluded = [3, 1, 3];

    const payload = toCreatePayload(value);

    expect(payload.tags_included).toEqual([1, 3]);
    expect(payload.tags_excluded).toEqual([]);
  });
});
