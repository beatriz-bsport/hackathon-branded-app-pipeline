import { describe, expect, it, vi } from "vitest";

import { SMARTLIST_REFERRER_COMPARATOR } from "@bsport/api-cdp/smartlist";

import { createDefaultReferrerFilter } from "#src/components/filters/referrer-filter/default-value";
import { toCreatePayload } from "#src/components/filters/referrer-filter/mappers/form-value-to-create-payload";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("toCreatePayload", () => {
  it("uses the smartlist id from form value", () => {
    const value = createDefaultReferrerFilter(123);

    const payload = toCreatePayload(value);

    expect(payload.smartlist).toBe(123);
  });

  it("maps primary comparator and values for non-between types", () => {
    const value = createDefaultReferrerFilter(1);
    value.comparator_referred = SMARTLIST_REFERRER_COMPARATOR.EQUAL;
    value.value_referred = 8;
    value.value_second_referred = 0;

    const payload = toCreatePayload(value);

    expect(payload.comparator_referred).toBe(
      SMARTLIST_REFERRER_COMPARATOR.EQUAL,
    );
    expect(payload.value_referred).toBe(8);
    expect(payload.value_second_referred).toBe(0);
  });

  it("maps value_second_referred for between comparator", () => {
    const value = createDefaultReferrerFilter(1);
    value.comparator_referred = SMARTLIST_REFERRER_COMPARATOR.BETWEEN;
    value.value_referred = 5;
    value.value_second_referred = 10;

    const payload = toCreatePayload(value);

    expect(payload.comparator_referred).toBe(
      SMARTLIST_REFERRER_COMPARATOR.BETWEEN,
    );
    expect(payload.value_referred).toBe(5);
    expect(payload.value_second_referred).toBe(10);
  });

  it("preserves inactive sub-filter flags and defaults on create", () => {
    const value = createDefaultReferrerFilter(1);
    value.value_obtained_reward_active = true;
    value.value_obtained_reward = 4;
    value.value_obtained_money_active = true;
    value.value_obtained_money = 50;

    const payload = toCreatePayload(value);

    expect(payload.value_obtained_reward_active).toBe(true);
    expect(payload.value_obtained_reward).toBe(4);
    expect(payload.value_obtained_money_active).toBe(true);
    expect(payload.value_obtained_money).toBe(50);
  });
});
