import { describe, expect, it, vi } from "vitest";

import { SmartlistCreditAccountFilterComparator } from "@bsport/api-cdp/smartlist";

import { CREDIT_ACCOUNT_NUMBER_TYPE } from "#src/components/filters/credit-account/constants";
import { createDefaultCreditAccountFilter } from "#src/components/filters/credit-account/default-value";
import { toCreatePayload } from "#src/components/filters/credit-account/mappers/form-value-to-create-payload";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("toCreatePayload", () => {
  it("uses the smartlist id from form value", () => {
    const value = createDefaultCreditAccountFilter(123);

    const payload = toCreatePayload(value);

    expect(payload.smartlist).toBe(123);
  });

  it("maps comparator and values for non-between types", () => {
    const value = createDefaultCreditAccountFilter(1);
    value.type = CREDIT_ACCOUNT_NUMBER_TYPE.greaterOrEqual;
    value.value = -5;
    value.secondValue = null;

    const payload = toCreatePayload(value);

    expect(payload.comparator).toBe(SmartlistCreditAccountFilterComparator.GTE);
    expect(payload.value).toBe(-5);
    expect(payload.value_second).toBe(0);
  });

  it("maps value_second for between comparator", () => {
    const value = createDefaultCreditAccountFilter(1);
    value.type = CREDIT_ACCOUNT_NUMBER_TYPE.between;
    value.value = 2;
    value.secondValue = 8;

    const payload = toCreatePayload(value);

    expect(payload.comparator).toBe(
      SmartlistCreditAccountFilterComparator.BETWEEN,
    );
    expect(payload.value).toBe(2);
    expect(payload.value_second).toBe(8);
  });
});
