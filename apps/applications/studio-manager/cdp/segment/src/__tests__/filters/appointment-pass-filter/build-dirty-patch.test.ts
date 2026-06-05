import { describe, expect, it } from "vitest";

import { createDefaultAppointmentPassFilter } from "#src/components/filters/appointment-pass-filter/default-value";
import { buildAppointmentPassDirtyPatchPayload } from "#src/components/filters/appointment-pass-filter/mappers/build-dirty-patch";
import { PASS_SUB_FILTER_IDS } from "#src/components/filters/passes-filter/sub-filters/pass-sub-filter-id";

type DirtyFields = Parameters<typeof buildAppointmentPassDirtyPatchPayload>[0];

describe("buildAppointmentPassDirtyPatchPayload", () => {
  it("emits `select_all_private_passes` when the select-all flag is dirty", () => {
    const value = createDefaultAppointmentPassFilter(1);
    value.selectAllPaymentPacks = true;
    const dirtyFields: DirtyFields = { selectAllPaymentPacks: true };

    const payload = buildAppointmentPassDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({ select_all_private_passes: true });
  });

  it("emits `private_passes` when the selection array is dirty", () => {
    const value = createDefaultAppointmentPassFilter(1);
    value.selectedPaymentPackIds = [4, 7];
    const dirtyFields: DirtyFields = {
      selectedPaymentPackIds: [
        true,
        true,
      ] as unknown as DirtyFields["selectedPaymentPackIds"],
    };

    const payload = buildAppointmentPassDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({ private_passes: [4, 7] });
  });

  it("emits `has_pack` when ownership is dirty", () => {
    const value = createDefaultAppointmentPassFilter(1);
    value.ownership = "does_not_own";
    const dirtyFields: DirtyFields = { ownership: true };

    const payload = buildAppointmentPassDirtyPatchPayload(dirtyFields, value);

    expect(payload).toEqual({ has_pack: false });
  });

  it("includes purchase date slice when purchase sub-filter is dirty", () => {
    const value = createDefaultAppointmentPassFilter(1);
    value.subFilters = [PASS_SUB_FILTER_IDS.purchaseDate];
    value.purchaseDate.dateType = "absolute";
    value.purchaseDate.absolute.operator = "on_or_after";
    value.purchaseDate.absolute.fromDate = "2026-03-01";
    value.purchaseDate.absolute.toDate = null;
    const dirtyFields: DirtyFields = {
      subFilters: [true],
    };

    const payload = buildAppointmentPassDirtyPatchPayload(dirtyFields, value);

    expect(payload.date_filter_active).toBe(true);
    expect(payload.date_bought).toBe("2026-03-01");
  });
});
