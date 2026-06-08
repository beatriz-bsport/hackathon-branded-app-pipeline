import { describe, expect, it, vi } from "vitest";

import {
  SmartlistCreditComparator,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { createDefaultAppointmentPassFilter } from "#src/components/filters/appointment-pass-filter/default-value";
import { createAppointmentPassPayload } from "#src/components/filters/appointment-pass-filter/mappers/form-value-to-create-payload";
import { PASS_SUB_FILTER_IDS } from "#src/components/filters/passes-filter/sub-filters/pass-sub-filter-id";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

describe("createAppointmentPassPayload", () => {
  it("uses the smartlist id from the form value", () => {
    const formValue = createDefaultAppointmentPassFilter(123);

    const payload = createAppointmentPassPayload(formValue);

    expect(payload.smartlist).toBe(123);
  });

  it("maps ownership and private pass selection fields", () => {
    const formValue = createDefaultAppointmentPassFilter(1);
    formValue.ownership = "does_not_own";
    formValue.selectAllPaymentPacks = false;
    formValue.selectedPaymentPackIds = [10, 11];

    const payload = createAppointmentPassPayload(formValue);

    expect(payload.has_pack).toBe(false);
    expect(payload.select_all_private_passes).toBe(false);
    expect(payload.private_passes).toEqual([10, 11]);
  });

  it("defaults to all private passes and inactive sub-filters", () => {
    const formValue = createDefaultAppointmentPassFilter(1);

    const payload = createAppointmentPassPayload(formValue);

    expect(payload).toMatchObject({
      smartlist: 1,
      has_pack: true,
      select_all_private_passes: false,
      private_passes: [],
      date_filter_active: false,
      credit_filter_active: false,
      expiration_date_filter_active: false,
      credit_comparator: SmartlistCreditComparator.GTE,
      date_filter_type: SmartlistDateFilterType.DATE_AFTER,
    });
  });

  it("activates credit API fields when the credit sub-filter is selected", () => {
    const formValue = createDefaultAppointmentPassFilter(1);
    formValue.subFilters = [PASS_SUB_FILTER_IDS.creditLeft];
    formValue.creditLeft = {
      operator: NUMERIC_COMPARATOR_OPERATORS.greaterOrEqual,
      firstValue: 5,
      secondValue: null,
    };

    const payload = createAppointmentPassPayload(formValue);

    expect(payload.credit_filter_active).toBe(true);
    expect(payload.credit_value).toBe(5);
  });
});
