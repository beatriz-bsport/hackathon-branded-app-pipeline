import { describe, expect, it } from "vitest";

import {
  dedupeSortedTagIds,
  haveSameTagIdMembers,
} from "#src/components/filters/tag-filter/mappers/tag-ids";

describe("tag-ids helpers", () => {
  it("dedupeSortedTagIds sorts and removes duplicates", () => {
    expect(dedupeSortedTagIds([3, 1, 3, 2])).toEqual([1, 2, 3]);
  });

  it("haveSameTagIdMembers ignores order", () => {
    expect(haveSameTagIdMembers([2, 1], [1, 2, 1])).toBe(true);
  });

  it("haveSameTagIdMembers returns false for different lengths after dedupe", () => {
    expect(haveSameTagIdMembers([1], [1, 2])).toBe(false);
  });
});
