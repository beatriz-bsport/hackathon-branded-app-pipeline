import { describe, expect, it, vi } from "vitest";

import {
  type CreditAccountFilter,
  SmartlistCreditAccountFilterComparator,
} from "@bsport/api-cdp/smartlist";

import { CREDIT_ACCOUNT_NUMBER_TYPE } from "#src/components/filters/credit-account/constants";
import { mapCreditAccountFilterToFormValue } from "#src/components/filters/credit-account/mappers/api-to-form-value";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const CREDIT_ACCOUNT_FILTER_IDENTIFIER = 1;

const buildCreditAccountFilter = (
  overrides: Partial<CreditAccountFilter> = {},
): CreditAccountFilter => ({
  id: 55,
  company_id: 7,
  smartlist: 123,
  filter_identifier: CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  comparator: SmartlistCreditAccountFilterComparator.LTE,
  value: 0,
  value_second: 20,
  ...overrides,
});

describe("mapCreditAccountFilterToFormValue", () => {
  it("maps LTE comparator to lower-or-equal type", () => {
    const filter = buildCreditAccountFilter({
      comparator: SmartlistCreditAccountFilterComparator.LTE,
      value: 10,
      value_second: 99,
    });

    const form = mapCreditAccountFilterToFormValue(filter);

    expect(form.type).toBe(CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual);
    expect(form.value).toBe(10);
    expect(form.secondValue).toBeNull();
  });

  it("maps BETWEEN and keeps second bound", () => {
    const filter = buildCreditAccountFilter({
      comparator: SmartlistCreditAccountFilterComparator.BETWEEN,
      value: -50,
      value_second: 100,
    });

    const form = mapCreditAccountFilterToFormValue(filter);

    expect(form.type).toBe(CREDIT_ACCOUNT_NUMBER_TYPE.between);
    expect(form.value).toBe(-50);
    expect(form.secondValue).toBe(100);
  });

  it("maps LT from API to lower-or-equal UI type", () => {
    const filter = buildCreditAccountFilter({
      comparator: SmartlistCreditAccountFilterComparator.LT,
      value: 3,
    });

    const form = mapCreditAccountFilterToFormValue(filter);

    expect(form.type).toBe(CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual);
    expect(form.value).toBe(3);
  });

  it("maps GTE comparator to greater-or-equal type", () => {
    const filter = buildCreditAccountFilter({
      comparator: SmartlistCreditAccountFilterComparator.GTE,
      value: 15,
      value_second: 99,
    });

    const form = mapCreditAccountFilterToFormValue(filter);

    expect(form.type).toBe(CREDIT_ACCOUNT_NUMBER_TYPE.greaterOrEqual);
    expect(form.value).toBe(15);
    expect(form.secondValue).toBeNull();
  });

  it("maps GT from API to greater-or-equal UI type", () => {
    const filter = buildCreditAccountFilter({
      comparator: SmartlistCreditAccountFilterComparator.GT,
      value: 7,
    });

    const form = mapCreditAccountFilterToFormValue(filter);

    expect(form.type).toBe(CREDIT_ACCOUNT_NUMBER_TYPE.greaterOrEqual);
    expect(form.value).toBe(7);
  });

  it("defaults unknown comparator to lower-or-equal", () => {
    const filter = buildCreditAccountFilter({
      comparator: 99 as SmartlistCreditAccountFilterComparator,
    });

    const form = mapCreditAccountFilterToFormValue(filter);

    expect(form.type).toBe(CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual);
  });

  it("preserves smartlist and id", () => {
    const filter = buildCreditAccountFilter();
    const form = mapCreditAccountFilterToFormValue(filter);

    expect(form.id).toBe(55);
    expect(form.smartlist).toBe(123);
  });
});
