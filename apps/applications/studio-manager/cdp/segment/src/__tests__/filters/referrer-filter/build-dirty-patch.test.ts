import { describe, expect, it, vi } from "vitest";

import { SMARTLIST_REFERRER_COMPARATOR } from "@bsport/api-cdp/smartlist";

import { createDefaultReferrerFilter } from "#src/components/filters/referrer-filter/default-value";
import {
  type ReferrerFilterDirtyFields,
  buildReferrerFilterDirtyPatch,
} from "#src/components/filters/referrer-filter/mappers/build-dirty-patch";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("buildReferrerFilterDirtyPatch", () => {
  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultReferrerFilter(1);
    const dirtyFields: ReferrerFilterDirtyFields = {};

    const payload = buildReferrerFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits primary fields when comparator_referred is dirty", () => {
    const value = createDefaultReferrerFilter(1);
    value.comparator_referred = SMARTLIST_REFERRER_COMPARATOR.EQUAL;
    value.value_referred = 4;
    const dirtyFields: ReferrerFilterDirtyFields = {
      comparator_referred: true,
    };

    const payload = buildReferrerFilterDirtyPatch(dirtyFields, value);

    expect(payload.comparator_referred).toBe(
      SMARTLIST_REFERRER_COMPARATOR.EQUAL,
    );
    expect(payload.value_referred).toBe(4);
    expect(payload.value_second_referred).toBe(0);
  });

  it("emits value_second_referred when between comparator is used", () => {
    const value = createDefaultReferrerFilter(1);
    value.comparator_referred = SMARTLIST_REFERRER_COMPARATOR.BETWEEN;
    value.value_referred = 5;
    value.value_second_referred = 10;
    const dirtyFields: ReferrerFilterDirtyFields = {
      value_second_referred: true,
    };

    const payload = buildReferrerFilterDirtyPatch(dirtyFields, value);

    expect(payload.comparator_referred).toBe(
      SMARTLIST_REFERRER_COMPARATOR.BETWEEN,
    );
    expect(payload.value_referred).toBe(5);
    expect(payload.value_second_referred).toBe(10);
  });

  it("does not emit sub-filter fields when only sub-filter values are dirty", () => {
    const value = createDefaultReferrerFilter(1);
    value.value_obtained_reward_active = true;
    value.value_obtained_reward = 4;
    const dirtyFields: ReferrerFilterDirtyFields = {
      value_obtained_reward_active: true,
      value_obtained_reward: true,
    };

    const payload = buildReferrerFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });
});
