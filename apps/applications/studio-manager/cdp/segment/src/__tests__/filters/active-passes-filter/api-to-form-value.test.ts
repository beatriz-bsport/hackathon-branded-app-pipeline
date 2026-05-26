import { describe, expect, it, vi } from "vitest";

import {
  type ActivePassesFilter,
  SmartlistActivePassesComparator,
} from "@bsport/api-cdp/smartlist";

import { ACTIVE_PASSES_COMPARATOR_TYPE } from "#src/components/filters/active-passes-filter/constants";
import { mapActivePassesFilterToFormValue } from "#src/components/filters/active-passes-filter/mappers/api-to-form-value";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: { t: (key: string) => key },
}));

const ACTIVE_PASSES_FILTER_IDENTIFIER = 27;

const buildActivePassesFilter = (
  overrides: Partial<ActivePassesFilter> = {},
): ActivePassesFilter => ({
  id: 901,
  company_id: 1,
  smartlist: 123,
  filter_identifier: ACTIVE_PASSES_FILTER_IDENTIFIER,
  select_all_payment_packs: true,
  payment_packs: [],
  select_all_private_passes: false,
  private_passes: [],
  nb_active_passes_comparator: SmartlistActivePassesComparator.GTE,
  nb_active_passes_value: 1,
  nb_active_passes_value_second: 0,
  ...overrides,
});

describe("mapActivePassesFilterToFormValue", () => {
  it("preserves id and smartlist fields", () => {
    const filter = buildActivePassesFilter();

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.id).toBe(901);
    expect(form.smartlist).toBe(123);
  });

  it("maps GTE comparator to greaterOrEqual type", () => {
    const filter = buildActivePassesFilter({
      nb_active_passes_comparator: SmartlistActivePassesComparator.GTE,
      nb_active_passes_value: 2,
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.comparatorType).toBe(
      ACTIVE_PASSES_COMPARATOR_TYPE.greaterOrEqual,
    );
    expect(form.comparatorValue).toBe(2);
    expect(form.comparatorValueSecond).toBeNull();
  });

  it("maps LTE comparator to lowerOrEqual type", () => {
    const filter = buildActivePassesFilter({
      nb_active_passes_comparator: SmartlistActivePassesComparator.LTE,
      nb_active_passes_value: 3,
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.comparatorType).toBe(
      ACTIVE_PASSES_COMPARATOR_TYPE.lowerOrEqual,
    );
  });

  it("maps EQUAL comparator to equal type", () => {
    const filter = buildActivePassesFilter({
      nb_active_passes_comparator: SmartlistActivePassesComparator.EQUAL,
      nb_active_passes_value: 1,
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.comparatorType).toBe(ACTIVE_PASSES_COMPARATOR_TYPE.equal);
  });

  it("maps BETWEEN and keeps second value", () => {
    const filter = buildActivePassesFilter({
      nb_active_passes_comparator: SmartlistActivePassesComparator.BETWEEN,
      nb_active_passes_value: 2,
      nb_active_passes_value_second: 5,
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.comparatorType).toBe(ACTIVE_PASSES_COMPARATOR_TYPE.between);
    expect(form.comparatorValue).toBe(2);
    expect(form.comparatorValueSecond).toBe(5);
  });

  it("sets comparatorValueSecond to null for non-BETWEEN comparators", () => {
    const filter = buildActivePassesFilter({
      nb_active_passes_comparator: SmartlistActivePassesComparator.LTE,
      nb_active_passes_value: 1,
      nb_active_passes_value_second: 0,
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.comparatorValueSecond).toBeNull();
  });

  it("enables paymentPacksSelector and sets selectAll true when select_all_payment_packs is true", () => {
    const filter = buildActivePassesFilter({
      select_all_payment_packs: true,
      payment_packs: [],
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.paymentPacksSelector.enabled).toBe(true);
    expect(form.paymentPacksSelector.selectAll).toBe(true);
    expect(form.paymentPacksSelector.selectedIds).toEqual([]);
  });

  it("enables paymentPacksSelector with selectAll false when specific packs are selected", () => {
    const filter = buildActivePassesFilter({
      select_all_payment_packs: false,
      payment_packs: [101, 102],
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.paymentPacksSelector.enabled).toBe(true);
    expect(form.paymentPacksSelector.selectAll).toBe(false);
    expect(form.paymentPacksSelector.selectedIds).toEqual([101, 102]);
  });

  it("disables paymentPacksSelector when both select_all is false and ids are empty", () => {
    const filter = buildActivePassesFilter({
      select_all_payment_packs: false,
      payment_packs: [],
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.paymentPacksSelector.enabled).toBe(false);
    expect(form.paymentPacksSelector.selectAll).toBe(false);
  });

  it("enables privatePassesSelector with selectAll true when select_all_private_passes is true", () => {
    const filter = buildActivePassesFilter({
      select_all_private_passes: true,
      private_passes: [],
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.privatePassesSelector.enabled).toBe(true);
    expect(form.privatePassesSelector.selectAll).toBe(true);
    expect(form.privatePassesSelector.selectedIds).toEqual([]);
  });

  it("enables privatePassesSelector with selectAll false when specific private passes are selected", () => {
    const filter = buildActivePassesFilter({
      select_all_private_passes: false,
      private_passes: [201, 202],
    });

    const form = mapActivePassesFilterToFormValue(filter);

    expect(form.privatePassesSelector.enabled).toBe(true);
    expect(form.privatePassesSelector.selectAll).toBe(false);
    expect(form.privatePassesSelector.selectedIds).toEqual([201, 202]);
  });
});
