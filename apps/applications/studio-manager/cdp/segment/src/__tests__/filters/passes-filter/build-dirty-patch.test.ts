import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { createDefaultPassesFilter } from "#src/components/filters/passes-filter/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/passes-filter/mappers/build-dirty-patch";
import { PASS_SUB_FILTER_IDS } from "#src/components/filters/passes-filter/sub-filters/pass-sub-filter-id";
import type { PassesFilterFormValue } from "#src/components/filters/passes-filter/types";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<PassesFilterFormValue>>
>;

describe("buildDirtyPatchPayload", () => {
  it("returns an empty payload when no field is dirty", () => {
    const value = createDefaultPassesFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits `has_pack` only when ownership is dirty", () => {
    const value = createDefaultPassesFilter(1);
    value.ownership = "does_not_own";
    const dirtyFields: DirtyFields = { ownership: true };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({ has_pack: false });
  });

  it("emits `select_all_payment_packs` only when the toggle is dirty", () => {
    const value = createDefaultPassesFilter(1);
    value.selectAllPaymentPacks = true;
    const dirtyFields: DirtyFields = { selectAllPaymentPacks: true };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({ select_all_payment_packs: true });
  });

  it("emits `payment_packs` when the selection array is dirty", () => {
    const value = createDefaultPassesFilter(1);
    value.selectedPaymentPackIds = [4, 7];
    const dirtyFields: DirtyFields = {
      selectedPaymentPackIds: [
        true,
        true,
      ] as unknown as DirtyFields["selectedPaymentPackIds"],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({ payment_packs: [4, 7] });
  });

  it("emits `payment_packs` as an empty array when selection was cleared", () => {
    const value = createDefaultPassesFilter(1);
    value.selectedPaymentPackIds = [];
    const dirtyFields: DirtyFields = {
      selectedPaymentPackIds:
        [] as unknown as DirtyFields["selectedPaymentPackIds"],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({ payment_packs: [] });
  });

  it("ignores keys that are flagged as not dirty", () => {
    const value = createDefaultPassesFilter(1);
    value.selectedPaymentPackIds = [4];
    const dirtyFields: DirtyFields = {
      selectedPaymentPackIds:
        false as unknown as DirtyFields["selectedPaymentPackIds"],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("combines several dirty fields in a single payload", () => {
    const value = createDefaultPassesFilter(8);
    value.ownership = "does_not_own";
    value.selectAllPaymentPacks = false;
    value.selectedPaymentPackIds = [5];
    const dirtyFields: DirtyFields = {
      ownership: true,
      selectAllPaymentPacks: true,
      selectedPaymentPackIds: [
        true,
      ] as unknown as DirtyFields["selectedPaymentPackIds"],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({
      has_pack: false,
      select_all_payment_packs: false,
      payment_packs: [5],
    });
    expect(payload).not.toHaveProperty("smartlist");
  });

  it("includes purchase date API fields when `subFilters` is dirty", () => {
    const value = createDefaultPassesFilter(1);
    value.selectAllPaymentPacks = true;
    value.subFilters = [PASS_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate.dateType = "absolute";
    value.purchaseDate.absolute.operator = "on_or_after";
    value.purchaseDate.absolute.fromDate = "2026-04-10";
    value.purchaseDate.absolute.toDate = null;
    const dirtyFields: DirtyFields = {
      subFilters: [true],
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_bought).toBe("2026-04-10");
  });

  it("includes expiration date API fields when `expirationDate` is dirty", () => {
    const value = createDefaultPassesFilter(1);
    value.selectAllPaymentPacks = true;
    value.subFilters = [PASS_SUB_FILTER_IDS.expirationDate];
    value.expirationDate.dateType = "absolute";
    value.expirationDate.absolute.operator = "on_or_after";
    value.expirationDate.absolute.fromDate = "2026-06-15";
    value.expirationDate.absolute.toDate = null;
    const dirtyFields: DirtyFields = {
      expirationDate: {
        absolute: { fromDate: true },
      },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.expiration_date_filter_active).toBe(true);
    expect(payload.expiration_date).toBe("2026-06-15");
  });

  it("includes credit API fields when `creditLeft` is dirty", () => {
    const value = createDefaultPassesFilter(1);
    value.selectAllPaymentPacks = true;
    value.subFilters = [PASS_SUB_FILTER_IDS.creditLeft];
    value.creditLeft.firstValue = 8;
    value.creditLeft.secondValue = null;
    const dirtyFields: DirtyFields = {
      creditLeft: { firstValue: true },
    };

    const payload = buildDirtyPatchPayload(dirtyFields, value);

    expect(payload.credit_filter_active).toBe(true);
    expect(payload.credit_value).toBe(8);
  });
});
