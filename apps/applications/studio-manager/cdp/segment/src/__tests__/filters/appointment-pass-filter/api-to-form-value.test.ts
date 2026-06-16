import { describe, expect, it, vi } from "vitest";

import {
  PRIVATE_PASS_FILTER_IDENTIFIER,
  type PrivatePassFilter,
  SmartlistCreditComparator,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { mapPrivatePassFilterToFormValue } from "#src/components/filters/appointment-pass-filter/mappers/api-to-form-value";
import { PASS_SUB_FILTER_IDS } from "#src/components/filters/passes-filter/sub-filters/pass-sub-filter-id";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const buildApiFilter = (
  overrides: Partial<PrivatePassFilter> = {},
): PrivatePassFilter => ({
  id: 1,
  company_id: 1,
  smartlist: 1,
  filter_identifier: Number(PRIVATE_PASS_FILTER_IDENTIFIER),
  private_passes: [],
  select_all_private_passes: false,
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

describe("mapPrivatePassFilterToFormValue", () => {
  it("maps `has_pack: true` to ownership 'own'", () => {
    const formValue = mapPrivatePassFilterToFormValue(
      buildApiFilter({ has_pack: true }),
    );

    expect(formValue.ownership).toBe("own");
  });

  it("maps `has_pack: false` to ownership 'does_not_own'", () => {
    const formValue = mapPrivatePassFilterToFormValue(
      buildApiFilter({ has_pack: false }),
    );

    expect(formValue.ownership).toBe("does_not_own");
  });

  it("maps `select_all_private_passes` and `private_passes` into form pass fields", () => {
    const formValue = mapPrivatePassFilterToFormValue(
      buildApiFilter({
        select_all_private_passes: true,
        private_passes: [2, 5, 8],
      }),
    );

    expect(formValue.selectAllPaymentPacks).toBe(true);
    expect(formValue.selectedPaymentPackIds).toEqual([2, 5, 8]);
  });

  it("includes purchase date sub-filter when `date_filter_active` is true", () => {
    const formValue = mapPrivatePassFilterToFormValue(
      buildApiFilter({
        date_filter_active: true,
        date_filter_type: SmartlistDateFilterType.DATE_EXACT,
        date_bought: "2026-01-15",
        date_bought_second: "2026-01-15",
      }),
    );

    expect(formValue.subFilters).toContain(PASS_SUB_FILTER_IDS.purchaseDate);
    expect(formValue.purchaseDate.absolute.fromDate).toBe("2026-01-15");
  });
});
