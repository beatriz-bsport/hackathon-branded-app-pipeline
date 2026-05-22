import { describe, expect, it } from "vitest";

import type { TagFilter } from "@bsport/api-cdp/smartlist";

import { mapTagFilterToFormValue } from "#src/components/filters/tag-filter/mappers/api-to-form-value";

const buildTagFilter = (overrides: Partial<TagFilter> = {}): TagFilter => ({
  id: 1,
  company_id: 9,
  smartlist: 100,
  filter_identifier: 11,
  tags_included: [],
  tags_excluded: [],
  ...overrides,
});

describe("mapTagFilterToFormValue", () => {
  it("enables include by default when both sides are empty (legacy row)", () => {
    const result = mapTagFilterToFormValue(buildTagFilter());

    expect(result.includeSectionEnabled).toBe(true);
    expect(result.excludeSectionEnabled).toBe(false);
    expect(result.tagsIncluded).toEqual([]);
    expect(result.tagsExcluded).toEqual([]);
  });

  it("enables include when only included tags exist", () => {
    const result = mapTagFilterToFormValue(
      buildTagFilter({ tags_included: [10, 11], tags_excluded: [] }),
    );

    expect(result.includeSectionEnabled).toBe(true);
    expect(result.excludeSectionEnabled).toBe(false);
    expect(result.tagsIncluded).toEqual([10, 11]);
  });

  it("disables include UI when only excluded tags exist", () => {
    const result = mapTagFilterToFormValue(
      buildTagFilter({ tags_included: [], tags_excluded: [20] }),
    );

    expect(result.includeSectionEnabled).toBe(false);
    expect(result.excludeSectionEnabled).toBe(true);
    expect(result.tagsExcluded).toEqual([20]);
  });

  it("enables both sections when both sides have tags", () => {
    const result = mapTagFilterToFormValue(
      buildTagFilter({ tags_included: [1], tags_excluded: [2] }),
    );

    expect(result.includeSectionEnabled).toBe(true);
    expect(result.excludeSectionEnabled).toBe(true);
  });
});
