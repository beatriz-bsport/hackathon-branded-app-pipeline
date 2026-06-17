import { describe, expect, it, vi } from "vitest";

import {
  type ReferrerFilter,
  SMARTLIST_REFERRER_COMPARATOR,
} from "@bsport/api-cdp/smartlist";

import { mapReferrerFilterToFormValue } from "#src/components/filters/referrer-filter/mappers/api-to-form-value";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const REFERRER_FILTER_IDENTIFIER = 29;

const buildReferrerFilter = (
  overrides: Partial<ReferrerFilter> = {},
): ReferrerFilter => ({
  id: 84,
  company_id: 7,
  smartlist: 123,
  filter_identifier: REFERRER_FILTER_IDENTIFIER,
  comparator_referred: SMARTLIST_REFERRER_COMPARATOR.GTE,
  value_referred: 1,
  value_second_referred: 0,
  value_obtained_reward_active: false,
  value_obtained_reward: 0,
  value_second_reward: 0,
  comparator_reward: SMARTLIST_REFERRER_COMPARATOR.GTE,
  value_obtained_money_active: false,
  value_obtained_money: 0,
  value_second_obtained_money: 0,
  comparator_obtained_money: SMARTLIST_REFERRER_COMPARATOR.GTE,
  ...overrides,
});

describe("mapReferrerFilterToFormValue", () => {
  it("maps GTE comparator and primary values", () => {
    const filter = buildReferrerFilter({
      comparator_referred: SMARTLIST_REFERRER_COMPARATOR.GTE,
      value_referred: 3,
      value_second_referred: 99,
    });

    const form = mapReferrerFilterToFormValue(filter);

    expect(form.comparator_referred).toBe(SMARTLIST_REFERRER_COMPARATOR.GTE);
    expect(form.value_referred).toBe(3);
    expect(form.value_second_referred).toBe(99);
  });

  it("maps BETWEEN and keeps second bound", () => {
    const filter = buildReferrerFilter({
      comparator_referred: SMARTLIST_REFERRER_COMPARATOR.BETWEEN,
      value_referred: 5,
      value_second_referred: 10,
    });

    const form = mapReferrerFilterToFormValue(filter);

    expect(form.comparator_referred).toBe(
      SMARTLIST_REFERRER_COMPARATOR.BETWEEN,
    );
    expect(form.value_referred).toBe(5);
    expect(form.value_second_referred).toBe(10);
  });

  it("preserves sub-filter fields from the API", () => {
    const filter = buildReferrerFilter({
      value_obtained_reward_active: true,
      value_obtained_reward: 4,
      value_second_reward: 0,
      comparator_reward: SMARTLIST_REFERRER_COMPARATOR.EQUAL,
      value_obtained_money_active: true,
      value_obtained_money: 50,
      value_second_obtained_money: 0,
      comparator_obtained_money: SMARTLIST_REFERRER_COMPARATOR.EQUAL,
    });

    const form = mapReferrerFilterToFormValue(filter);

    expect(form.value_obtained_reward_active).toBe(true);
    expect(form.value_obtained_reward).toBe(4);
    expect(form.comparator_reward).toBe(SMARTLIST_REFERRER_COMPARATOR.EQUAL);
    expect(form.value_obtained_money_active).toBe(true);
    expect(form.value_obtained_money).toBe(50);
    expect(form.comparator_obtained_money).toBe(
      SMARTLIST_REFERRER_COMPARATOR.EQUAL,
    );
  });

  it("preserves smartlist and id", () => {
    const filter = buildReferrerFilter();
    const form = mapReferrerFilterToFormValue(filter);

    expect(form.id).toBe(84);
    expect(form.smartlist).toBe(123);
  });
});
