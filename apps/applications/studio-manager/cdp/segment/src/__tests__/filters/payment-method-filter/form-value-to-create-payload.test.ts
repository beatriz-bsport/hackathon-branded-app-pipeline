import { describe, expect, it } from "vitest";

import { SmartlistDateFilterType } from "@bsport/api-cdp/smartlist";

import { OWNS_PAYMENT_METHOD } from "#src/components/filters/payment-method-filter/constants";
import { createDefaultPaymentMethodFilter } from "#src/components/filters/payment-method-filter/default-value";
import { createPaymentMethodFilterPayload } from "#src/components/filters/payment-method-filter/mappers/form-value-to-create-payload";
import { PAYMENT_METHOD_SUB_FILTER_IDS } from "#src/components/filters/payment-method-filter/sub-filters/payment-method-sub-filter-id";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";

describe("createPaymentMethodFilterPayload", () => {
  it("creates a minimal has-payment-method payload by default", () => {
    const value = createDefaultPaymentMethodFilter(123);

    const payload = createPaymentMethodFilterPayload(value);

    expect(payload).toMatchObject({
      smartlist: 123,
      owns_payment_method: true,
      date_filter_active: false,
      date: null,
      date_second: null,
      duration: 0,
      duration_second: 0,
      payment_method_kind_filter_active: false,
      kind_value: null,
    });
  });

  it("creates does-not-have payload when option is doesNotHave", () => {
    const value = createDefaultPaymentMethodFilter(5);
    value.ownsPaymentMethod = OWNS_PAYMENT_METHOD.doesNotHave;

    const payload = createPaymentMethodFilterPayload(value);

    expect(payload.owns_payment_method).toBe(false);
    expect(payload.date_filter_active).toBe(false);
  });

  it("activates expiration date fields when expiration sub-filter is selected", () => {
    const value = createDefaultPaymentMethodFilter(1);
    value.subFilters = [PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate];
    value.expirationDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: "2024-06-15",
        toDate: null,
      },
      relative: value.expirationDate.relative,
    };

    const payload = createPaymentMethodFilterPayload(value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_EXACT);
    expect(payload.date).toBe("2024-06-15");
    expect(payload.date_second).toBe("2024-06-15");
  });

  it("does not activate expiration date when member does not have a method", () => {
    const value = createDefaultPaymentMethodFilter(1);
    value.ownsPaymentMethod = OWNS_PAYMENT_METHOD.doesNotHave;
    value.subFilters = [PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate];
    value.expirationDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: "2024-06-15",
        toDate: null,
      },
      relative: value.expirationDate.relative,
    };

    const payload = createPaymentMethodFilterPayload(value);

    expect(payload.date_filter_active).toBe(false);
  });

  describe("expiration date sub-filter — relative operators", () => {
    it.each([
      {
        operator: RELATIVE_DATE_OPERATORS.pastMoreThan,
        days: 30,
        expectedType: SmartlistDateFilterType.DURATION_BEFORE_PAST,
        expectedDuration: -30,
      },
      {
        operator: RELATIVE_DATE_OPERATORS.pastExactly,
        days: 7,
        expectedType: SmartlistDateFilterType.DURATION_EXACT,
        expectedDuration: -7,
      },
      {
        operator: RELATIVE_DATE_OPERATORS.futureMoreThan,
        days: 14,
        expectedType: SmartlistDateFilterType.DURATION_AFTER,
        expectedDuration: 14,
      },
      {
        operator: RELATIVE_DATE_OPERATORS.futureExactly,
        days: 21,
        expectedType: SmartlistDateFilterType.DURATION_EXACT,
        expectedDuration: 21,
      },
    ])(
      "maps $operator to signed duration fields",
      ({ operator, days, expectedType, expectedDuration }) => {
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
            operator,
            firstDays: days,
            secondDays: null,
          },
        };

        const payload = createPaymentMethodFilterPayload(value);

        expect(payload).toMatchObject({
          date_filter_active: true,
          date_filter_type: expectedType,
          duration: expectedDuration,
          duration_second: 0,
        });
      },
    );

    it("maps past_between to signed duration range fields", () => {
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

      const payload = createPaymentMethodFilterPayload(value);

      expect(payload).toMatchObject({
        date_filter_active: true,
        date_filter_type: SmartlistDateFilterType.DURATION_BETWEEN,
        duration: -10,
        duration_second: -30,
      });
    });

    it("maps future_between to positive duration range fields", () => {
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
          operator: RELATIVE_DATE_OPERATORS.futureBetween,
          firstDays: 5,
          secondDays: 20,
        },
      };

      const payload = createPaymentMethodFilterPayload(value);

      expect(payload).toMatchObject({
        date_filter_active: true,
        date_filter_type: SmartlistDateFilterType.DURATION_BETWEEN,
        duration: 5,
        duration_second: 20,
      });
    });
  });
});
