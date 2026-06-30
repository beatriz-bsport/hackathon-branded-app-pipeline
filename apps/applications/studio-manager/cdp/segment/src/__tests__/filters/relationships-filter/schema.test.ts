import { describe, expect, it, vi } from "vitest";

import { SMARTLIST_RELATIONS_COMPARATOR } from "@bsport/api-cdp/smartlist";

import { createDefaultRelationshipsFilter } from "#src/components/filters/relationships-filter/default-value";
import { relationshipsFilterSchema } from "#src/components/filters/relationships-filter/schema";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("relationshipsFilterSchema", () => {
  it("accepts the default create values", () => {
    const value = createDefaultRelationshipsFilter(1);

    const result = relationshipsFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts a valid between range", () => {
    const value = createDefaultRelationshipsFilter(1);
    value.comparator_number_relations = SMARTLIST_RELATIONS_COMPARATOR.BETWEEN;
    value.value_number_relations = 1;
    value.value_number_relations_second = 3;

    const result = relationshipsFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts GTE with zero relationships", () => {
    const value = createDefaultRelationshipsFilter(1);
    value.comparator_number_relations = SMARTLIST_RELATIONS_COMPARATOR.GTE;
    value.value_number_relations = 0;

    const result = relationshipsFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects between when second value is below first", () => {
    const value = createDefaultRelationshipsFilter(1);
    value.comparator_number_relations = SMARTLIST_RELATIONS_COMPARATOR.BETWEEN;
    value.value_number_relations = 10;
    value.value_number_relations_second = 2;

    const result = relationshipsFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
