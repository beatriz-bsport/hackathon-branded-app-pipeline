import { describe, expect, it } from "vitest";

import { createDefaultTagFilterFormValue } from "#src/components/filters/tag-filter/default-value";
import { tagFilterFormSchema } from "#src/components/filters/tag-filter/schema";

describe("tagFilterFormSchema", () => {
  it("rejects smartlist id that is not a positive integer", () => {
    const value = createDefaultTagFilterFormValue(0);

    const result = tagFilterFormSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects when no effective tags are selected", () => {
    const value = createDefaultTagFilterFormValue(1);
    value.includeSectionEnabled = true;
    value.excludeSectionEnabled = false;
    value.tagsIncluded = [];
    value.tagsExcluded = [];

    const result = tagFilterFormSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["tagsIncluded"]);
    }
  });

  it("accepts only included tags when include section is enabled", () => {
    const value = createDefaultTagFilterFormValue(1);
    value.includeSectionEnabled = true;
    value.tagsIncluded = [7];

    const result = tagFilterFormSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts only excluded tags when exclude section is enabled", () => {
    const value = createDefaultTagFilterFormValue(1);
    value.includeSectionEnabled = false;
    value.excludeSectionEnabled = true;
    value.tagsExcluded = [3];

    const result = tagFilterFormSchema.safeParse(value);

    expect(result.success).toBe(true);
  });
});
