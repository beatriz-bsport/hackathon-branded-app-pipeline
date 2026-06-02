import { describe, expect, it, vi } from "vitest";

import { SmartlistActivePassesComparator } from "@bsport/api-cdp/smartlist";

import { ACTIVE_PASSES_COMPARATOR_TYPE } from "#src/components/filters/active-passes-filter/constants";
import { createDefaultActivePassesFilter } from "#src/components/filters/active-passes-filter/default-value";
import { createActivePassesPayload } from "#src/components/filters/active-passes-filter/mappers/form-value-to-create-payload";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: { t: (key: string) => key },
}));

describe("createActivePassesPayload (active passes filter)", () => {
  it("uses the smartlist id from form value", () => {
    const value = createDefaultActivePassesFilter(42);

    const payload = createActivePassesPayload(value);

    expect(payload.smartlist).toBe(42);
  });

  it("maps GTE comparator and value correctly", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.greaterOrEqual;
    value.comparatorValue = 3;

    const payload = createActivePassesPayload(value);

    expect(payload.nb_active_passes_comparator).toBe(
      SmartlistActivePassesComparator.GTE,
    );
    expect(payload.nb_active_passes_value).toBe(3);
    expect(payload.nb_active_passes_value_second).toBe(0);
  });

  it("maps BETWEEN comparator and both values", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.between;
    value.comparatorValue = 2;
    value.comparatorValueSecond = 8;

    const payload = createActivePassesPayload(value);

    expect(payload.nb_active_passes_comparator).toBe(
      SmartlistActivePassesComparator.BETWEEN,
    );
    expect(payload.nb_active_passes_value).toBe(2);
    expect(payload.nb_active_passes_value_second).toBe(8);
  });

  it("sets select_all_payment_packs to true when payment packs enabled with selectAll flag", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: true,
      selectedIds: [],
    };

    const payload = createActivePassesPayload(value);

    expect(payload.select_all_payment_packs).toBe(true);
    expect(payload.payment_packs).toEqual([]);
  });

  it("sets select_all_payment_packs to false when specific packs are selected", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [101, 102],
    };

    const payload = createActivePassesPayload(value);

    expect(payload.select_all_payment_packs).toBe(false);
    expect(payload.payment_packs).toEqual([101, 102]);
  });

  it("sends empty payment_packs and false select_all when the section is disabled", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [101],
    };

    const payload = createActivePassesPayload(value);

    expect(payload.select_all_payment_packs).toBe(false);
    expect(payload.payment_packs).toEqual([]);
  });

  it("sets select_all_private_passes to true when appointment passes enabled with selectAll flag", () => {
    const value = createDefaultActivePassesFilter(1);
    value.appointmentPassesSelector = {
      enabled: true,
      selectAll: true,
      selectedIds: [],
    };

    const payload = createActivePassesPayload(value);

    expect(payload.select_all_private_passes).toBe(true);
    expect(payload.private_passes).toEqual([]);
  });

  it("sends specific private_passes ids when enabled with selections", () => {
    const value = createDefaultActivePassesFilter(1);
    value.appointmentPassesSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [201],
    };

    const payload = createActivePassesPayload(value);

    expect(payload.select_all_private_passes).toBe(false);
    expect(payload.private_passes).toEqual([201]);
  });

  it("sends empty private_passes and false select_all when appointment passes section is disabled", () => {
    const value = createDefaultActivePassesFilter(1);
    value.appointmentPassesSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [201],
    };

    const payload = createActivePassesPayload(value);

    expect(payload.select_all_private_passes).toBe(false);
    expect(payload.private_passes).toEqual([]);
  });

  it("uses comparatorValue as second value fallback for between with no second value", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.between;
    value.comparatorValue = 3;
    value.comparatorValueSecond = null;

    const payload = createActivePassesPayload(value);

    expect(payload.nb_active_passes_value_second).toBe(3);
  });
});
