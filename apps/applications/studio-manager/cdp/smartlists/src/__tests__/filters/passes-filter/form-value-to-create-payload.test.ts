import { describe, expect, it } from "vitest";

import {
  SmartlistCreditComparator,
  SmartlistDateFilterType,
} from "@bsport/api-cdp/smartlist";

import { createDefaultPassesFilter } from "#src/components/filters/passes-filter/default-value";
import { toCreatePayload } from "#src/components/filters/passes-filter/mappers/form-value-to-create-payload";

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
});
