import { describe, expect, it, vi } from "vitest";

import { SMARTLIST_RELATIONS_COMPARATOR } from "@bsport/api-cdp/smartlist";

import { createDefaultRelationshipsFilter } from "#src/components/filters/relationships-filter/default-value";
import {
  type RelationshipsFilterDirtyFields,
  buildRelationshipsFilterDirtyPatch,
} from "#src/components/filters/relationships-filter/mappers/build-dirty-patch";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("buildRelationshipsFilterDirtyPatch", () => {
  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultRelationshipsFilter(1);
    const dirtyFields: RelationshipsFilterDirtyFields = {};

    const payload = buildRelationshipsFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits only comparator when comparator changes", () => {
    const value = createDefaultRelationshipsFilter(1);
    value.comparator_number_relations = SMARTLIST_RELATIONS_COMPARATOR.EQUAL;
    value.value_number_relations = 4;
    value.value_number_relations_second = 8;
    const dirtyFields: RelationshipsFilterDirtyFields = {
      comparator_number_relations: true,
    };

    const payload = buildRelationshipsFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({
      comparator_number_relations: SMARTLIST_RELATIONS_COMPARATOR.EQUAL,
    });
  });

  it("emits only value_number_relations when first value changes", () => {
    const value = createDefaultRelationshipsFilter(1);
    value.value_number_relations = 4;
    const dirtyFields: RelationshipsFilterDirtyFields = {
      value_number_relations: true,
    };

    const payload = buildRelationshipsFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({
      value_number_relations: 4,
    });
  });

  it("emits only value_number_relations_second when second value changes", () => {
    const value = createDefaultRelationshipsFilter(1);
    value.comparator_number_relations = SMARTLIST_RELATIONS_COMPARATOR.BETWEEN;
    value.value_number_relations = 1;
    value.value_number_relations_second = 3;
    const dirtyFields: RelationshipsFilterDirtyFields = {
      value_number_relations_second: true,
    };

    const payload = buildRelationshipsFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({
      value_number_relations_second: 3,
    });
  });
});
