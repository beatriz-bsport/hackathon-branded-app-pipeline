import { describe, expect, it, vi } from "vitest";

import { SmartlistCreditAccountFilterComparator } from "@bsport/api-cdp/smartlist";

import { CREDIT_ACCOUNT_NUMBER_TYPE } from "#src/components/filters/credit-account/constants";
import { createDefaultCreditAccountFilter } from "#src/components/filters/credit-account/default-value";
import {
  CreditAccountFilterDirtyFields,
  buildCreditAccountFilterDirtyPatch,
} from "#src/components/filters/credit-account/mappers/build-dirty-patch";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("buildCreditAccountFilterDirtyPatch", () => {
  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultCreditAccountFilter(1);
    const dirtyFields: CreditAccountFilterDirtyFields = {};

    const payload = buildCreditAccountFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits comparator/value fields when type is dirty", () => {
    const value = createDefaultCreditAccountFilter(1);
    value.type = CREDIT_ACCOUNT_NUMBER_TYPE.equal;
    value.value = 4;
    const dirtyFields: CreditAccountFilterDirtyFields = { type: true };

    const payload = buildCreditAccountFilterDirtyPatch(dirtyFields, value);

    expect(payload.comparator).toBe(
      SmartlistCreditAccountFilterComparator.EQUAL,
    );
    expect(payload.value).toBe(4);
    expect(payload.value_second).toBe(0);
  });

  it("emits value_second when between comparator is used", () => {
    const value = createDefaultCreditAccountFilter(1);
    value.type = CREDIT_ACCOUNT_NUMBER_TYPE.between;
    value.value = 1;
    value.secondValue = 6;
    const dirtyFields: CreditAccountFilterDirtyFields = {
      secondValue: true,
    };

    const payload = buildCreditAccountFilterDirtyPatch(dirtyFields, value);

    expect(payload.comparator).toBe(
      SmartlistCreditAccountFilterComparator.BETWEEN,
    );
    expect(payload.value).toBe(1);
    expect(payload.value_second).toBe(6);
  });
});
