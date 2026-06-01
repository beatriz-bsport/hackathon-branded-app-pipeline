import { describe, expect, it, vi } from "vitest";

import { CREDIT_ACCOUNT_NUMBER_TYPE } from "#src/components/filters/credit-account/constants";
import { createDefaultCreditAccountFilter } from "#src/components/filters/credit-account/default-value";
import { creditAccountFilterSchema } from "#src/components/filters/credit-account/schema";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("creditAccountFilterSchema", () => {
  it("accepts a valid between range", () => {
    const value = createDefaultCreditAccountFilter(1);
    value.type = CREDIT_ACCOUNT_NUMBER_TYPE.between;
    value.value = 1;
    value.secondValue = 5;

    const result = creditAccountFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects between when second value is missing", () => {
    const value = createDefaultCreditAccountFilter(1);
    value.type = CREDIT_ACCOUNT_NUMBER_TYPE.between;
    value.value = 1;
    value.secondValue = null;

    const result = creditAccountFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects between when second value is below first", () => {
    const value = createDefaultCreditAccountFilter(1);
    value.type = CREDIT_ACCOUNT_NUMBER_TYPE.between;
    value.value = 10;
    value.secondValue = 2;

    const result = creditAccountFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
