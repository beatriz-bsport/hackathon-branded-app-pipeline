import { describe, expect, it, vi } from "vitest";

import { OWNS_PAYMENT_METHOD } from "#src/components/filters/payment-method-filter/constants";
import { createDefaultPaymentMethodFilter } from "#src/components/filters/payment-method-filter/default-value";
import { paymentMethodFilterSchema } from "#src/components/filters/payment-method-filter/schema";
import { PAYMENT_METHOD_SUB_FILTER_IDS } from "#src/components/filters/payment-method-filter/sub-filters/payment-method-sub-filter-id";
import type { PaymentMethodFilterFormValue } from "#src/components/filters/payment-method-filter/types";
import {
  ABSOLUTE_DATE_OPERATORS,
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";
import { createDefaultDateFilterValue } from "#src/components/primitive-filters/date-filter/utils";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("paymentMethodFilterSchema", () => {
  it("accepts a default has-payment-method filter", () => {
    const value = createDefaultPaymentMethodFilter(1);

    const result = paymentMethodFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts does-not-have without expiration date", () => {
    const value = createDefaultPaymentMethodFilter(1);
    value.ownsPaymentMethod = OWNS_PAYMENT_METHOD.doesNotHave;

    const result = paymentMethodFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects active expiration date without a from date", () => {
    const value = createDefaultPaymentMethodFilter(1);
    value.subFilters = [PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate];
    value.expirationDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: null,
        toDate: null,
      },
      relative: value.expirationDate.relative,
    };

    const result = paymentMethodFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("does not require expiration date when does-not-have is selected", () => {
    const value = createDefaultPaymentMethodFilter(1);
    value.ownsPaymentMethod = OWNS_PAYMENT_METHOD.doesNotHave;
    value.subFilters = [PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate];
    value.expirationDate = {
      dateType: DATE_FILTER_TYPES.absolute,
      absolute: {
        operator: ABSOLUTE_DATE_OPERATORS.exactlyOn,
        fromDate: null,
        toDate: null,
      },
      relative: value.expirationDate.relative,
    };

    const result = paymentMethodFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  describe("expiration date sub-filter — relative operators", () => {
    const buildRelativeExpirationDateValue = (
      operator: (typeof RELATIVE_DATE_OPERATORS)[keyof typeof RELATIVE_DATE_OPERATORS],
      firstDays: number | null,
      secondDays: number | null,
    ): PaymentMethodFilterFormValue => {
      const formValue = createDefaultPaymentMethodFilter(1);
      formValue.subFilters = [PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate];
      formValue.expirationDate = {
        ...createDefaultDateFilterValue(),
        dateType: DATE_FILTER_TYPES.relative,
        relative: {
          operator,
          firstDays,
          secondDays,
        },
      };
      return formValue;
    };

    it.each([
      RELATIVE_DATE_OPERATORS.pastMoreThan,
      RELATIVE_DATE_OPERATORS.pastExactly,
      RELATIVE_DATE_OPERATORS.futureMoreThan,
      RELATIVE_DATE_OPERATORS.futureExactly,
    ])(
      "rejects single-value operator %s when firstDays is missing",
      (operator) => {
        const formValue = buildRelativeExpirationDateValue(
          operator,
          null,
          null,
        );

        const result = paymentMethodFilterSchema.safeParse(formValue);

        expect(result.success).toBe(false);
        if (!result.success) {
          const issuePaths = result.error.issues.map((issue) => issue.path);
          expect(issuePaths).toContainEqual([
            "expirationDate",
            "relative",
            "firstDays",
          ]);
        }
      },
    );

    it.each([
      RELATIVE_DATE_OPERATORS.pastMoreThan,
      RELATIVE_DATE_OPERATORS.pastExactly,
      RELATIVE_DATE_OPERATORS.futureMoreThan,
      RELATIVE_DATE_OPERATORS.futureExactly,
    ])("accepts single-value operator %s when firstDays is set", (operator) => {
      const formValue = buildRelativeExpirationDateValue(operator, 30, null);

      const result = paymentMethodFilterSchema.safeParse(formValue);

      expect(result.success).toBe(true);
    });

    it.each([
      RELATIVE_DATE_OPERATORS.pastBetween,
      RELATIVE_DATE_OPERATORS.futureBetween,
    ])("rejects between operator %s when secondDays is missing", (operator) => {
      const formValue = buildRelativeExpirationDateValue(operator, 10, null);

      const result = paymentMethodFilterSchema.safeParse(formValue);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issuePaths = result.error.issues.map((issue) => issue.path);
        expect(issuePaths).toContainEqual([
          "expirationDate",
          "relative",
          "secondDays",
        ]);
      }
    });

    it.each([
      RELATIVE_DATE_OPERATORS.pastBetween,
      RELATIVE_DATE_OPERATORS.futureBetween,
    ])("rejects between operator %s when firstDays is missing", (operator) => {
      const formValue = buildRelativeExpirationDateValue(operator, null, 10);

      const result = paymentMethodFilterSchema.safeParse(formValue);

      expect(result.success).toBe(false);
      if (!result.success) {
        const issuePaths = result.error.issues.map((issue) => issue.path);
        expect(issuePaths).toContainEqual([
          "expirationDate",
          "relative",
          "firstDays",
        ]);
      }
    });

    it.each([
      RELATIVE_DATE_OPERATORS.pastBetween,
      RELATIVE_DATE_OPERATORS.futureBetween,
    ])(
      "accepts between operator %s when both firstDays and secondDays are set",
      (operator) => {
        const formValue = buildRelativeExpirationDateValue(operator, 10, 30);

        const result = paymentMethodFilterSchema.safeParse(formValue);

        expect(result.success).toBe(true);
      },
    );

    it("does not require relative expiration date when does-not-have is selected", () => {
      const formValue = buildRelativeExpirationDateValue(
        RELATIVE_DATE_OPERATORS.pastMoreThan,
        null,
        null,
      );
      formValue.ownsPaymentMethod = OWNS_PAYMENT_METHOD.doesNotHave;

      const result = paymentMethodFilterSchema.safeParse(formValue);

      expect(result.success).toBe(true);
    });
  });
});
