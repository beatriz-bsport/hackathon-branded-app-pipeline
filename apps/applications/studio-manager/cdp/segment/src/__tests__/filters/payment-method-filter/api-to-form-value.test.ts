import { describe, expect, it } from "vitest";

import {
  type PaymentMethodFilter,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { OWNS_PAYMENT_METHOD } from "#src/components/filters/payment-method-filter/constants";
import { mapPaymentMethodFilterToFormValue } from "#src/components/filters/payment-method-filter/mappers/api-to-form-value";
import { PAYMENT_METHOD_SUB_FILTER_IDS } from "#src/components/filters/payment-method-filter/sub-filters/payment-method-sub-filter-id";
import {
  DATE_FILTER_TYPES,
  RELATIVE_DATE_OPERATORS,
} from "#src/components/primitive-filters/date-filter/constants";

const PAYMENT_METHOD_FILTER_IDENTIFIER = 600;

const buildApiFilter = (
  overrides: Partial<PaymentMethodFilter> = {},
): PaymentMethodFilter => ({
  id: 1,
  company: 1,
  smartlist: 1,
  filter_identifier: PAYMENT_METHOD_FILTER_IDENTIFIER,
  owns_payment_method: true,
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_BEFORE,
  date: null,
  date_second: null,
  duration: 0,
  duration_second: 0,
  payment_method_kind_filter_active: false,
  kind_value: null,
  ...overrides,
});

describe("mapPaymentMethodFilterToFormValue", () => {
  it("maps owns_payment_method true to the has option", () => {
    const filter = buildApiFilter({ owns_payment_method: true });

    const formValue = mapPaymentMethodFilterToFormValue(filter);

    expect(formValue.ownsPaymentMethod).toBe(OWNS_PAYMENT_METHOD.has);
    expect(formValue.subFilters).toEqual([]);
  });

  it("maps owns_payment_method false to the doesNotHave option", () => {
    const filter = buildApiFilter({ owns_payment_method: false });

    const formValue = mapPaymentMethodFilterToFormValue(filter);

    expect(formValue.ownsPaymentMethod).toBe(OWNS_PAYMENT_METHOD.doesNotHave);
  });

  it("activates expiration date sub-filter when date_filter_active is true", () => {
    const filter = buildApiFilter({
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DATE_EXACT,
      date: "2024-06-15",
      date_second: "2024-06-15",
    });

    const formValue = mapPaymentMethodFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual([
      PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate,
    ]);
    expect(formValue.expirationDate.absolute.fromDate).toBe("2024-06-15");
  });

  it("does not activate expiration date sub-filter when member does not own a method", () => {
    const filter = buildApiFilter({
      owns_payment_method: false,
      date_filter_active: true,
      date: "2024-06-15",
      date_second: "2024-06-15",
    });

    const formValue = mapPaymentMethodFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual([]);
  });

  it("preserves the smartlist id and the filter id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapPaymentMethodFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });

  describe("expiration date sub-filter — relative operators", () => {
    it("maps negative duration from API into past_more_than form value", () => {
      const filter = buildApiFilter({
        date_filter_active: true,
        date_filter_type: SmartlistDateFilterType.DURATION_BEFORE_PAST,
        date: null,
        date_second: null,
        duration: -30,
        duration_second: 0,
      });

      const formValue = mapPaymentMethodFilterToFormValue(filter);

      expect(formValue.subFilters).toEqual([
        PAYMENT_METHOD_SUB_FILTER_IDS.expirationDate,
      ]);
      expect(formValue.expirationDate.dateType).toBe(
        DATE_FILTER_TYPES.relative,
      );
      expect(formValue.expirationDate.relative.operator).toBe(
        RELATIVE_DATE_OPERATORS.pastMoreThan,
      );
      expect(formValue.expirationDate.relative.firstDays).toBe(30);
      expect(formValue.expirationDate.relative.secondDays).toBeNull();
    });

    it("maps positive duration from API into future_more_than form value", () => {
      const filter = buildApiFilter({
        date_filter_active: true,
        date_filter_type: SmartlistDateFilterType.DURATION_AFTER,
        date: null,
        date_second: null,
        duration: 14,
        duration_second: 0,
      });

      const formValue = mapPaymentMethodFilterToFormValue(filter);

      expect(formValue.expirationDate.dateType).toBe(
        DATE_FILTER_TYPES.relative,
      );
      expect(formValue.expirationDate.relative.operator).toBe(
        RELATIVE_DATE_OPERATORS.futureMoreThan,
      );
      expect(formValue.expirationDate.relative.firstDays).toBe(14);
    });

    it("maps signed duration range from API into past_between form value", () => {
      const filter = buildApiFilter({
        date_filter_active: true,
        date_filter_type: SmartlistDateFilterType.DURATION_BETWEEN,
        date: null,
        date_second: null,
        duration: -10,
        duration_second: -30,
      });

      const formValue = mapPaymentMethodFilterToFormValue(filter);

      expect(formValue.expirationDate.dateType).toBe(
        DATE_FILTER_TYPES.relative,
      );
      expect(formValue.expirationDate.relative.operator).toBe(
        RELATIVE_DATE_OPERATORS.pastBetween,
      );
      expect(formValue.expirationDate.relative.firstDays).toBe(10);
      expect(formValue.expirationDate.relative.secondDays).toBe(30);
    });

    it("maps positive duration range from API into future_between form value", () => {
      const filter = buildApiFilter({
        date_filter_active: true,
        date_filter_type: SmartlistDateFilterType.DURATION_BETWEEN,
        date: null,
        date_second: null,
        duration: 5,
        duration_second: 20,
      });

      const formValue = mapPaymentMethodFilterToFormValue(filter);

      expect(formValue.expirationDate.relative.operator).toBe(
        RELATIVE_DATE_OPERATORS.futureBetween,
      );
      expect(formValue.expirationDate.relative.firstDays).toBe(5);
      expect(formValue.expirationDate.relative.secondDays).toBe(20);
    });
  });
});
