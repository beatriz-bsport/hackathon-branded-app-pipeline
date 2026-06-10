import { describe, expect, it, vi } from "vitest";

import { AgeFilterComparator } from "@bsport/api-cdp/smartlist";

import { AGE_FILTER_NUMBER_TYPE } from "#src/components/filters/age-filter/constants";
import { createDefaultAgeFilter } from "#src/components/filters/age-filter/default-value";
import {
  type AgeFilterDirtyFields,
  buildAgeFilterDirtyPatch,
} from "#src/components/filters/age-filter/mappers/build-dirty-patch";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("buildAgeFilterDirtyPatch", () => {
  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultAgeFilter(1);
    const dirtyFields: AgeFilterDirtyFields = {};

    const payload = buildAgeFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits comparator and value fields when type is dirty", () => {
    const value = createDefaultAgeFilter(1);
    value.type = AGE_FILTER_NUMBER_TYPE.equal;
    value.value = 20;
    const dirtyFields: AgeFilterDirtyFields = { type: true };

    const payload = buildAgeFilterDirtyPatch(dirtyFields, value);

    expect(payload.comparator).toBe(AgeFilterComparator.EQUAL);
    expect(payload.value).toBe(20);
    expect(payload.value_second).toBe(0);
  });

  it("emits value_second when between comparator is used", () => {
    const value = createDefaultAgeFilter(1);
    value.type = AGE_FILTER_NUMBER_TYPE.between;
    value.value = 18;
    value.secondValue = 30;
    const dirtyFields: AgeFilterDirtyFields = {
      secondValue: true,
    };

    const payload = buildAgeFilterDirtyPatch(dirtyFields, value);

    expect(payload.comparator).toBe(AgeFilterComparator.BETWEEN);
    expect(payload.value).toBe(18);
    expect(payload.value_second).toBe(30);
  });
});
