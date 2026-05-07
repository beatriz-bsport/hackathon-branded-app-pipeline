import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { createDefaultPassesFilter } from "#src/components/filters/passes-filter/default-value";
import { buildDirtyPatchPayload } from "#src/components/filters/passes-filter/mappers/build-dirty-patch";
import type { PassesFilterFormValue } from "#src/components/filters/passes-filter/types";

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
});
