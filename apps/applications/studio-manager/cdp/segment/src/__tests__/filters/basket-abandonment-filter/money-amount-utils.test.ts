import { describe, expect, it } from "vitest";

import {
  apiBasketValueToFormAmount,
  formAmountToApiBasketValue,
} from "#src/components/filters/basket-abandonment-filter/utils/money-amount-utils";

describe("money-amount-utils", () => {
  it("maps form amounts to API values 1:1", () => {
    expect(formAmountToApiBasketValue(10)).toBe(10);
    expect(apiBasketValueToFormAmount(11)).toBe(11);
    expect(formAmountToApiBasketValue(0)).toBe(0);
  });
});
