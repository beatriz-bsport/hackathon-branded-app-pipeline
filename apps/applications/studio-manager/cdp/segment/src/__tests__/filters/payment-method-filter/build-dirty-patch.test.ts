import { describe, expect, it } from "vitest";

import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import { OWNS_PAYMENT_METHOD } from "#src/components/filters/payment-method-filter/constants";
import { createDefaultPaymentMethodFilter } from "#src/components/filters/payment-method-filter/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/payment-method-filter/mappers/build-dirty-patch";
import { PAYMENT_METHOD_SUB_FILTER_IDS } from "#src/components/filters/payment-method-filter/sub-filters/payment-method-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";

describe("buildDirtyPatchPayload (payment method)", () => {
  it("patches owns_payment_method and clears date when doesNotHave is dirty", () => {
    const value = createDefaultPaymentMethodFilter(1);
    value.ownsPaymentMethod = OWNS_PAYMENT_METHOD.doesNotHave;

    const payload = buildDirtyPatchPayload({ ownsPaymentMethod: true }, value);

    expect(payload).toMatchObject({
      owns_payment_method: false,
      date_filter_active: false,
      payment_method_kind_filter_active: false,
      kind_value: null,
    });
  });

  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultPaymentMethodFilter(1);

    const payload = buildDirtyPatchPayload({}, value);

    expect(payload).toEqual({});
  });

  it("patches expiration date slice when expiration date is dirty", () => {
    const value = createDefaultPaymentMethodFilter(1);
    value.subFilters = [PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate];
    value.expirationDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: "2024-05-10",
        toDate: null,
      },
      relative: value.expirationDate.relative,
    };

    const payload = buildDirtyPatchPayload(
      { expirationDate: { absolute: { fromDate: true } } },
      value,
    );

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_EXACT);
    expect(payload.date).toBe("2024-05-10");
    expect(payload.payment_method_kind_filter_active).toBe(false);
    expect(payload.kind_value).toBeNull();
  });

  it("clears kind filter on any non-empty patch", () => {
    const value = createDefaultPaymentMethodFilter(1);
    value.ownsPaymentMethod = OWNS_PAYMENT_METHOD.has;

    const payload = buildDirtyPatchPayload({ ownsPaymentMethod: true }, value);

    expect(payload.payment_method_kind_filter_active).toBe(false);
    expect(payload.kind_value).toBeNull();
  });

  it("patches relative expiration date slice when relative days are dirty", () => {
    const value = createDefaultPaymentMethodFilter(1);
    value.subFilters = [PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate];
    value.expirationDate = {
      dateType: DATE_FILTER_TYPES.relative,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.onOrAfter,
        fromDate: null,
        toDate: null,
      },
      relative: {
        operator: RELATIVE_DATE_OPERATORS.pastBetween,
        firstDays: 10,
        secondDays: 30,
      },
    };

    const payload = buildDirtyPatchPayload(
      { expirationDate: { relative: { firstDays: true } } },
      value,
    );

    expect(payload).toMatchObject({
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DURATION_BETWEEN,
      duration: -10,
      duration_second: -30,
      payment_method_kind_filter_active: false,
      kind_value: null,
    });
  });
});
