import { describe, expect, it, vi } from "vitest";

import {
  type PaymentPackFilter,
  SmartlistCreditComparator,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { mapApiFilterToFormValue } from "#src/components/filters/passes-filter/mappers/api-to-form-value";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const PAYMENT_PACK_FILTER_IDENTIFIER = 19;

const buildApiFilter = (
  overrides: Partial<PaymentPackFilter> = {},
): PaymentPackFilter => ({
  id: 1,
  company_id: 1,
  smartlist: 1,
  filter_identifier: PAYMENT_PACK_FILTER_IDENTIFIER,
  payment_packs: [],
  select_all_payment_packs: false,
  has_pack: true,
  date_filter_active: false,
  date_filter_type: SmartlistDateFilterType.DATE_AFTER,
  date_bought: "",
  date_bought_second: "",
  duration_bought: 0,
  duration_bought_second: 0,
  credit_filter_active: false,
  credit_comparator: SmartlistCreditComparator.GTE,
  credit_value: 0,
  credit_value_second: 0,
  expiration_date_filter_active: false,
  expiration_date_filter_type: SmartlistDateFilterType.DATE_AFTER,
  expiration_date: "",
  expiration_date_second: "",
  expiration_duration: 0,
  expiration_duration_second: 0,
  ...overrides,
});

describe("mapApiFilterToFormValue", () => {
  it("maps `has_pack: true` to ownership 'own'", () => {
    const filter = buildApiFilter({ has_pack: true });

    const formValue = mapApiFilterToFormValue(filter);

    expect(formValue.ownership).toBe("own");
  });

  it("maps `has_pack: false` to ownership 'does_not_own'", () => {
    const filter = buildApiFilter({ has_pack: false });

    const formValue = mapApiFilterToFormValue(filter);

    expect(formValue.ownership).toBe("does_not_own");
  });

  it("preserves the smartlist id and the filter id", () => {
    const filter = buildApiFilter({ id: 42, smartlist: 7 });

    const formValue = mapApiFilterToFormValue(filter);

    expect(formValue.id).toBe(42);
    expect(formValue.smartlist).toBe(7);
  });

  it("maps `select_all_payment_packs` and the selected ids list", () => {
    const filter = buildApiFilter({
      select_all_payment_packs: true,
      payment_packs: [2, 5, 8],
    });

    const formValue = mapApiFilterToFormValue(filter);

    expect(formValue.selectAllPaymentPacks).toBe(true);
    expect(formValue.selectedPaymentPackIds).toEqual([2, 5, 8]);
  });

  it("falls back to an empty array when `payment_packs` is missing", () => {
    const filter = buildApiFilter({
      payment_packs: undefined as unknown as number[],
    });

    const formValue = mapApiFilterToFormValue(filter);

    expect(formValue.selectedPaymentPackIds).toEqual([]);
  });

  it("lists purchase date in `subFilters` when the API purchase filter is active", () => {
    const filter = buildApiFilter({
      date_filter_active: true,
      date_filter_type: SmartlistDateFilterType.DATE_AFTER,
      date_bought: "2026-04-01",
      date_bought_second: "2026-04-01",
    });

    const formValue = mapApiFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual(["purchase_date"]);
    expect(formValue.purchaseDate.absolute.fromDate).toBe("2026-04-01");
  });

  it("does not list purchase date in `subFilters` when the API filter is inactive", () => {
    const filter = buildApiFilter({
      date_filter_active: false,
      credit_filter_active: true,
      expiration_date_filter_active: true,
      credit_value: "10",
    });

    const formValue = mapApiFilterToFormValue(filter);

    expect(formValue.subFilters).toEqual([]);
    expect(formValue.purchaseDate.dateType).toBe("absolute");
  });
});
