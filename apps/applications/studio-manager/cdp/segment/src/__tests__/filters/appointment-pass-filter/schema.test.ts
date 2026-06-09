import { describe, expect, it, vi } from "vitest";

import { createDefaultAppointmentPassFilter } from "#src/components/filters/appointment-pass-filter/default-value";
import { appointmentPassFilterSchema } from "#src/components/filters/appointment-pass-filter/schema";
import type { AppointmentPassFilterFormValue } from "#src/components/filters/appointment-pass-filter/types";
import { PASS_SUB_FILTER_IDS } from "#src/components/filters/passes-filter/sub-filters/pass-sub-filter-id";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const buildFormValue = (
  overrides: Partial<AppointmentPassFilterFormValue> = {},
): AppointmentPassFilterFormValue => ({
  ...createDefaultAppointmentPassFilter(1),
  ...overrides,
});

describe("appointmentPassFilterSchema", () => {
  it("rejects default create state with all passes selected - no pass provided", () => {
    const formValue = createDefaultAppointmentPassFilter(1);

    const result = appointmentPassFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
    expect(result.error?.errors.map((error) => error.message)).toContain(
      "filters.25.validation.selectedPassesRequired",
    );
  });

  it("rejects scoped selection with an empty pass list", () => {
    const result = appointmentPassFilterSchema.safeParse(
      buildFormValue({
        selectAllPaymentPacks: false,
        selectedPaymentPackIds: [],
      }),
    );

    expect(result.success).toBe(false);
  });

  it("accepts scoped selection when at least one pass is selected", () => {
    const result = appointmentPassFilterSchema.safeParse(
      buildFormValue({
        selectAllPaymentPacks: false,
        selectedPaymentPackIds: [42],
      }),
    );

    expect(result.success).toBe(true);
  });

  it("requires purchase date when the purchase sub-filter is active", () => {
    const formValue = buildFormValue({
      selectAllPaymentPacks: true,
      subFilters: [PASS_SUB_FILTER_IDS.purchaseDate],
    });
    formValue.purchaseDate.dateType = "absolute";
    formValue.purchaseDate.absolute.operator = "on_or_after";
    formValue.purchaseDate.absolute.fromDate = null;
    formValue.purchaseDate.absolute.toDate = null;

    const result = appointmentPassFilterSchema.safeParse(formValue);

    expect(result.success).toBe(false);
  });
});
