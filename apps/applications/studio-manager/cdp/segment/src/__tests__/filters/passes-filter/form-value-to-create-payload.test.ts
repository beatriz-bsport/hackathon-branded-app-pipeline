import { describe, expect, it, vi } from "vitest";

import {
  SmartlistCreditComparator,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { createDefaultPassesFilter } from "#src/components/filters/passes-filter/default-value";
import { toCreatePayload } from "#src/components/filters/passes-filter/mappers/form-value-to-create-payload";
import { PASS_SUB_FILTER_IDS } from "#src/components/filters/passes-filter/sub-filters/pass-sub-filter-id";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("toCreatePayload", () => {
  it("uses the smartlist id from the form value", () => {
    const formValue = createDefaultPassesFilter(123);

    const payload = toCreatePayload(formValue);

    expect(payload.smartlist).toBe(123);
  });

  it("translates ownership 'own' into `has_pack: true`", () => {
    const formValue = createDefaultPassesFilter(1);
    formValue.ownership = "own";

    const payload = toCreatePayload(formValue);

    expect(payload.has_pack).toBe(true);
  });

  it("translates ownership 'does_not_own' into `has_pack: false`", () => {
    const formValue = createDefaultPassesFilter(1);
    formValue.ownership = "does_not_own";

    const payload = toCreatePayload(formValue);

    expect(payload.has_pack).toBe(false);
  });

  it("forwards `selectAllPaymentPacks` and `selectedPaymentPackIds`", () => {
    const formValue = createDefaultPassesFilter(1);
    formValue.selectAllPaymentPacks = false;
    formValue.selectedPaymentPackIds = [10, 11];

    const payload = toCreatePayload(formValue);

    expect(payload.select_all_payment_packs).toBe(false);
    expect(payload.payment_packs).toEqual([10, 11]);
  });

  it("emits sub-filter API fields with deactivated defaults", () => {
    const formValue = createDefaultPassesFilter(1);
    formValue.selectAllPaymentPacks = true;

    const payload = toCreatePayload(formValue);

    expect(payload).toMatchObject({
      smartlist: 1,
      has_pack: true,
      select_all_payment_packs: true,
      payment_packs: [],
      date_filter_active: false,
      credit_filter_active: false,
      expiration_date_filter_active: false,
    });
  });

  it("uses neutral defaults for sub-filter fields", () => {
    const formValue = createDefaultPassesFilter(1);

    const payload = toCreatePayload(formValue);

    expect(payload.date_filter_type).toBe(SmartlistDateFilterType.DATE_AFTER);
    expect(payload.expiration_date_filter_type).toBe(
      SmartlistDateFilterType.DATE_AFTER,
    );
    expect(payload.credit_comparator).toBe(SmartlistCreditComparator.GTE);
    expect(payload.credit_value).toBe(0);
    expect(payload.credit_value_second).toBe(0);
    expect(payload.duration_bought).toBe(0);
    expect(payload.duration_bought_second).toBe(0);
    expect(payload.expiration_duration).toBe(0);
    expect(payload.expiration_duration_second).toBe(0);
    expect(typeof payload.date_bought).toBe("string");
    expect(typeof payload.date_bought_second).toBe("string");
    expect(typeof payload.expiration_date).toBe("string");
    expect(typeof payload.expiration_date_second).toBe("string");
  });

  it("activates expiration date API fields when the expiration sub-filter is selected", () => {
    const formValue = createDefaultPassesFilter(1);
    formValue.selectAllPaymentPacks = true;
    formValue.subFilters = [PASS_SUB_FILTER_IDS.expirationDate];
    formValue.expirationDate.dateType = "absolute";
    formValue.expirationDate.absolute.operator = "on_or_after";
    formValue.expirationDate.absolute.fromDate = "2026-07-01";
    formValue.expirationDate.absolute.toDate = null;

    const payload = toCreatePayload(formValue);

    expect(payload.expiration_date_filter_active).toBe(true);
    expect(payload.expiration_date).toBe("2026-07-01");
  });

  it("activates credit API fields when the credit sub-filter is selected", () => {
    const formValue = createDefaultPassesFilter(1);
    formValue.selectAllPaymentPacks = true;
    formValue.subFilters = [PASS_SUB_FILTER_IDS.creditLeft];
    formValue.creditLeft = {
      operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
      firstValue: 5,
      secondValue: null,
    };

    const payload = toCreatePayload(formValue);

    expect(payload.credit_filter_active).toBe(true);
    expect(payload.credit_value).toBe(5);
  });
});
