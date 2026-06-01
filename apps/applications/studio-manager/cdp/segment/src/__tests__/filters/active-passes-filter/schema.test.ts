import { describe, expect, it, vi } from "vitest";

import { ACTIVE_PASSES_COMPARATOR_TYPE } from "#src/components/filters/active-passes-filter/constants";
import { createDefaultActivePassesFilter } from "#src/components/filters/active-passes-filter/default-value";
import { activePassesFilterSchema } from "#src/components/filters/active-passes-filter/schema";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: { t: (key: string) => key },
}));

describe("activePassesFilterSchema", () => {
  it("accepts a default form value with at least one section enabled", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.equal;
    value.comparatorValue = 12;
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [101],
    };
    value.privatePassesSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects a default form value without any section enabled", () => {
    const value = createDefaultActivePassesFilter(1);

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(1);
    expect(result.error?.issues?.[0]?.message).toBe(
      "filters.27.validation.atLeastOneSectionRequired",
    );
  });

  it("accepts a valid between range and at least one section enabled", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.between;
    value.comparatorValue = 1;
    value.comparatorValueSecond = 5;
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [101],
    };
    value.privatePassesSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects between when second value is null", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.between;
    value.comparatorValue = 1;
    value.comparatorValueSecond = null;

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects between when second value is below first value", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.between;
    value.comparatorValue = 10;
    value.comparatorValueSecond = 5;

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("rejects when both selectors are disabled", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };
    value.privatePassesSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts when only payment packs section is enabled with selectAll", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: true,
      selectedIds: [],
    };
    value.privatePassesSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects when payment packs is enabled but selectAll is false and no ids are selected", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [],
    };
    value.privatePassesSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts when only private passes section is enabled with selectAll", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };
    value.privatePassesSelector = {
      enabled: true,
      selectAll: true,
      selectedIds: [],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("rejects when private passes is enabled but selectAll is false and no ids are selected", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };
    value.privatePassesSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(false);
  });

  it("accepts when payment packs section is enabled with specific ids", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [101],
    };
    value.privatePassesSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts when both sections are enabled with selections", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [101],
    };
    value.privatePassesSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [201],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });

  it("accepts when both sections are enabled using selectAll", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: true,
      selectedIds: [],
    };
    value.privatePassesSelector = {
      enabled: true,
      selectAll: true,
      selectedIds: [],
    };

    const result = activePassesFilterSchema.safeParse(value);

    expect(result.success).toBe(true);
  });
});
