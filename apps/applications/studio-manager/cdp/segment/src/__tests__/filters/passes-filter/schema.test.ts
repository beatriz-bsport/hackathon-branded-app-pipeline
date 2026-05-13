import { describe, expect, it, vi } from "vitest";

import { createDefaultPassesFilter } from "#src/components/filters/passes-filter/default-value";
import { passesFilterSchema } from "#src/components/filters/passes-filter/schema";
import { PASS_SUB_FILTER_IDS } from "#src/components/filters/passes-filter/sub-filters/pass-sub-filter-id";
import type { PassesFilterFormValue } from "#src/components/filters/passes-filter/types";
import { NUMERIC_COMPARATOR_OPERATORS } from "#src/components/primitive-filters/numeric-comparator-filter/constants";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const buildFormValue = (
  overrides: Partial<PassesFilterFormValue> = {},
): PassesFilterFormValue => ({
  ...createDefaultPassesFilter(1),
  ...overrides,
});

describe("passesFilterSchema", () => {
  it("rejects a form when no pass is selected and `selectAll` is false", () => {
    const value = buildFormValue({
      selectAllPaymentPacks: false,
      selectedPaymentPackIds: [],
    });

    const result = passesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path);
      expect(issuePaths).toContainEqual(["selectedPaymentPackIds"]);
    }
  });

  it("accepts a form when `selectAll` is true even with an empty selection", () => {
    const value = buildFormValue({
      selectAllPaymentPacks: true,
      selectedPaymentPackIds: [],
    });

    const result = passesFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts a form when at least one pass is selected", () => {
    const value = buildFormValue({
      selectAllPaymentPacks: false,
      selectedPaymentPackIds: [1],
    });

    const result = passesFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects a non-positive smartlist id", () => {
    const value = buildFormValue({
      smartlist: 0,
      selectAllPaymentPacks: true,
    });

    const result = passesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects an unknown ownership value", () => {
    const value = {
      ...buildFormValue({ selectAllPaymentPacks: true }),
      ownership: "unknown",
    };

    const result = passesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects purchase date sub-filter when active but absolute from date is missing", () => {
    const value = buildFormValue({
      selectAllPaymentPacks: true,
      subFilters: [PASS_SUB_FILTER_IDS.purchaseDate],
      purchaseDate: {
        ...createDefaultPassesFilter(1).purchaseDate,
        dateType: "absolute",
        absolute: {
          operator: "on_or_after",
          fromDate: null,
          toDate: null,
        },
      },
    });

    const result = passesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects expiration date sub-filter when active but absolute from date is missing", () => {
    const value = buildFormValue({
      selectAllPaymentPacks: true,
      subFilters: [PASS_SUB_FILTER_IDS.expirationDate],
      expirationDate: {
        ...createDefaultPassesFilter(1).expirationDate,
        dateType: "absolute",
        absolute: {
          operator: "on_or_after",
          fromDate: null,
          toDate: null,
        },
      },
    });

    const result = passesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects credit left sub-filter when active but first value is missing", () => {
    const value = buildFormValue({
      selectAllPaymentPacks: true,
      subFilters: [PASS_SUB_FILTER_IDS.creditLeft],
      creditLeft: {
        ...createDefaultPassesFilter(1).creditLeft,
        firstValue: null,
      },
    });

    const result = passesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects credit left sub-filter when operator is between but second value is missing", () => {
    const value = buildFormValue({
      selectAllPaymentPacks: true,
      subFilters: [PASS_SUB_FILTER_IDS.creditLeft],
      creditLeft: {
        operator: NUMERIC_COMPARATOR_OPERATORS.between,
        firstValue: 1,
        secondValue: null,
      },
    });

    const result = passesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });
});
