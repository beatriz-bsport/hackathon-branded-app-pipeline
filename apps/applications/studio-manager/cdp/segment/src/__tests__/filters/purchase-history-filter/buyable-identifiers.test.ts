import { describe, expect, it } from "vitest";

import {
  ALL_EXPENSES_COMPLETE_BUYABLE_IDS,
  EXPENSES_COMPLETE_BUYABLE,
  buyableIdsFromFetch,
  buyableIdsToApi,
} from "@bsport/api-cdp/smartlist";

describe("expenses complete buyable identifiers", () => {
  it("maps empty API array to all product types in display order", () => {
    expect(buyableIdsFromFetch([])).toEqual([1, 9, 2, 10, 50]);
  });

  it("maps all selected UI ids to the full API identifier set", () => {
    expect(buyableIdsToApi([...ALL_EXPENSES_COMPLETE_BUYABLE_IDS])).toEqual([
      1, 2, 9, 10, 50,
    ]);
  });

  it("maps subset UI ids to the same subset for API", () => {
    expect(
      buyableIdsToApi([
        EXPENSES_COMPLETE_BUYABLE.PAYMENT_PACK,
        EXPENSES_COMPLETE_BUYABLE.WORKSHOP,
      ]),
    ).toEqual([1, 50]);
  });

  it("filters out invalid buyable ids before mapping to API", () => {
    expect(
      buyableIdsToApi([
        EXPENSES_COMPLETE_BUYABLE.PAYMENT_PACK,
        999,
        EXPENSES_COMPLETE_BUYABLE.WORKSHOP,
      ]),
    ).toEqual([1, 50]);
  });

  it("maps to the full API set when all valid ids are selected among invalid extras", () => {
    expect(
      buyableIdsToApi([...ALL_EXPENSES_COMPLETE_BUYABLE_IDS, 999]),
    ).toEqual([1, 2, 9, 10, 50]);
  });
});
