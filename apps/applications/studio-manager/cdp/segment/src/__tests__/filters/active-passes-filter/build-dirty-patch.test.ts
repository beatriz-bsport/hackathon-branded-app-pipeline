import type { FieldNamesMarkedBoolean } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";

import { SmartlistActivePassesComparator } from "@bsport/api-cdp/smartlist";

import { ACTIVE_PASSES_COMPARATOR_TYPE } from "#src/components/filters/active-passes-filter/constants";
import { createDefaultActivePassesFilter } from "#src/components/filters/active-passes-filter/default-value";
import { buildActivePassesFilterDirtyPatch } from "#src/components/filters/active-passes-filter/mappers/build-dirty-patch";
import type { ActivePassesFilterFormValue } from "#src/components/filters/active-passes-filter/types";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: { t: (key: string) => key },
}));

type DirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<ActivePassesFilterFormValue>>
>;

describe("buildActivePassesFilterDirtyPatch", () => {
  it("returns empty payload when nothing is dirty", () => {
    const value = createDefaultActivePassesFilter(1);
    const dirtyFields: DirtyFields = {};

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload).toEqual({});
  });

  it("emits comparator fields when comparatorType is dirty", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.equal;
    value.comparatorValue = 4;
    const dirtyFields: DirtyFields = { comparatorType: true };

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload.nb_active_passes_comparator).toBe(
      SmartlistActivePassesComparator.EQUAL,
    );
    expect(payload.nb_active_passes_value).toBe(4);
    expect(payload.nb_active_passes_value_second).toBe(0);
  });

  it("emits comparator fields when comparatorValue is dirty", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.greaterOrEqual;
    value.comparatorValue = 2;
    const dirtyFields: DirtyFields = { comparatorValue: true };

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload.nb_active_passes_comparator).toBe(
      SmartlistActivePassesComparator.GTE,
    );
    expect(payload.nb_active_passes_value).toBe(2);
  });

  it("emits second value when between comparator and comparatorValueSecond is dirty", () => {
    const value = createDefaultActivePassesFilter(1);
    value.comparatorType = ACTIVE_PASSES_COMPARATOR_TYPE.between;
    value.comparatorValue = 1;
    value.comparatorValueSecond = 6;
    const dirtyFields: DirtyFields = { comparatorValueSecond: true };

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload.nb_active_passes_comparator).toBe(
      SmartlistActivePassesComparator.BETWEEN,
    );
    expect(payload.nb_active_passes_value_second).toBe(6);
  });

  it("emits payment_packs with specific ids and select_all false when dirty", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [101, 102],
    };
    const dirtyFields: DirtyFields = {
      paymentPacksSelector: { enabled: false, selectedIds: [true, true] },
    };

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload.select_all_payment_packs).toBe(false);
    expect(payload.payment_packs).toEqual([101, 102]);
  });

  it("sends select_all_payment_packs true when enabled with selectAll flag set", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: true,
      selectAll: true,
      selectedIds: [],
    };
    const dirtyFields: DirtyFields = {
      paymentPacksSelector: { enabled: true },
    };

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload.select_all_payment_packs).toBe(true);
    expect(payload.payment_packs).toEqual([]);
  });

  it("sends empty payment_packs and false select_all when paymentPacksSelector is disabled", () => {
    const value = createDefaultActivePassesFilter(1);
    value.paymentPacksSelector = {
      enabled: false,
      selectAll: false,
      selectedIds: [],
    };
    const dirtyFields: DirtyFields = {
      paymentPacksSelector: { enabled: true },
    };

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload.select_all_payment_packs).toBe(false);
    expect(payload.payment_packs).toEqual([]);
  });

  it("emits private_passes fields with specific ids when dirty", () => {
    const value = createDefaultActivePassesFilter(1);
    value.privatePassesSelector = {
      enabled: true,
      selectAll: false,
      selectedIds: [201],
    };
    const dirtyFields: DirtyFields = {
      privatePassesSelector: { enabled: false, selectedIds: [true] },
    };

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload.select_all_private_passes).toBe(false);
    expect(payload.private_passes).toEqual([201]);
  });

  it("sends select_all_private_passes true when enabled with selectAll flag set", () => {
    const value = createDefaultActivePassesFilter(1);
    value.privatePassesSelector = {
      enabled: true,
      selectAll: true,
      selectedIds: [],
    };
    const dirtyFields: DirtyFields = {
      privatePassesSelector: { enabled: true },
    };

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload.select_all_private_passes).toBe(true);
    expect(payload.private_passes).toEqual([]);
  });

  it("does not emit payment_packs when only privatePassesSelector is dirty", () => {
    const value = createDefaultActivePassesFilter(1);
    const dirtyFields: DirtyFields = {
      privatePassesSelector: { enabled: true },
    };

    const payload = buildActivePassesFilterDirtyPatch(dirtyFields, value);

    expect(payload.payment_packs).toBeUndefined();
    expect(payload.select_all_payment_packs).toBeUndefined();
  });
});
