import { describe, expect, it, vi } from "vitest";

import { SMARTLIST_RELATIONS_COMPARATOR } from "@bsport/api-cdp/smartlist";

import { createDefaultRelationshipsFilter } from "#src/components/filters/relationships-filter/default-value";
import { toCreatePayload } from "#src/components/filters/relationships-filter/mappers/form-value-to-create-payload";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("toCreatePayload", () => {
  it("maps primary fields for a GTE filter", () => {
    const value = createDefaultRelationshipsFilter(123);

    const payload = toCreatePayload(value);

    expect(payload).toEqual({
      smartlist: 123,
      comparator_number_relations: SMARTLIST_RELATIONS_COMPARATOR.GTE,
      value_number_relations: 1,
      value_number_relations_second: 0,
    });
  });

  it("includes the second bound only for BETWEEN comparators", () => {
    const value = createDefaultRelationshipsFilter(123);
    value.comparator_number_relations = SMARTLIST_RELATIONS_COMPARATOR.BETWEEN;
    value.value_number_relations = 2;
    value.value_number_relations_second = 5;

    const payload = toCreatePayload(value);

    expect(payload.value_number_relations_second).toBe(5);
  });

  it("sends zero for the second bound when comparator is not BETWEEN", () => {
    const value = createDefaultRelationshipsFilter(123);
    value.comparator_number_relations = SMARTLIST_RELATIONS_COMPARATOR.EQUAL;
    value.value_number_relations = 0;
    value.value_number_relations_second = 8;

    const payload = toCreatePayload(value);

    expect(payload.value_number_relations_second).toBe(0);
  });
});
