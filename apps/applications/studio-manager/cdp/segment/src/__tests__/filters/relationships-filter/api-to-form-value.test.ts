import { describe, expect, it, vi } from "vitest";

import {
  type RelationsFilter,
  SMARTLIST_RELATIONS_COMPARATOR,
} from "@bsport/api-cdp/smartlist";

import { mapRelationshipsFilterToFormValue } from "#src/components/filters/relationships-filter/mappers/api-to-form-value";

vi.mock("#src/utils/i18n", () => ({
  i18nInstance: {
    t: (key: string) => key,
  },
}));

const RELATIONS_FILTER_IDENTIFIER = 105;

const buildRelationsFilter = (
  overrides: Partial<RelationsFilter> = {},
): RelationsFilter => ({
  id: 501,
  company: 7,
  smartlist: 123,
  filter_identifier: RELATIONS_FILTER_IDENTIFIER,
  comparator_number_relations: SMARTLIST_RELATIONS_COMPARATOR.GTE,
  value_number_relations: 1,
  value_number_relations_second: 0,
  date_filter_active: false,
  date: "2026-06-19",
  date_second: "2026-06-19",
  date_filter_type: 3,
  duration: 0,
  duration_second: 0,
  number_relations_consumer_payment_packs_filter_active: false,
  value_number_relations_consumer_payment_packs: 0,
  value_number_relations_consumer_payment_packs_second: 0,
  comparator_number_relations_consumer_payment_packs: 2,
  consumer_payment_packs_must_be_valid: false,
  number_relations_consumer_private_passes_filter_active: false,
  value_number_relations_consumer_private_passes: 0,
  value_number_relations_consumer_private_passes_second: 0,
  comparator_number_relations_consumer_private_passes: 2,
  consumer_private_passes_must_be_valid: false,
  number_relations_bookings_filter_active: false,
  value_number_relations_bookings: 0,
  value_number_relations_bookings_second: 0,
  comparator_number_relations_bookings: 2,
  relation_receive_copy_of_email_filter_active: false,
  relation_receive_copy_of_email: false,
  relation_accept_sms_filter_active: false,
  relation_accept_sms: false,
  relation_accept_email_filter_active: false,
  relation_accept_email: false,
  ...overrides,
});

describe("mapRelationshipsFilterToFormValue", () => {
  it("maps GTE comparator and primary values", () => {
    const filter = buildRelationsFilter({
      comparator_number_relations: SMARTLIST_RELATIONS_COMPARATOR.GTE,
      value_number_relations: 3,
      value_number_relations_second: 99,
    });

    const form = mapRelationshipsFilterToFormValue(filter);

    expect(form.comparator_number_relations).toBe(
      SMARTLIST_RELATIONS_COMPARATOR.GTE,
    );
    expect(form.value_number_relations).toBe(3);
    expect(form.value_number_relations_second).toBe(99);
    expect(form.hadDeprecatedSubFiltersAtHydration).toBe(false);
  });

  it("maps BETWEEN and keeps second bound", () => {
    const filter = buildRelationsFilter({
      comparator_number_relations: SMARTLIST_RELATIONS_COMPARATOR.BETWEEN,
      value_number_relations: 1,
      value_number_relations_second: 3,
    });

    const form = mapRelationshipsFilterToFormValue(filter);

    expect(form.comparator_number_relations).toBe(
      SMARTLIST_RELATIONS_COMPARATOR.BETWEEN,
    );
    expect(form.value_number_relations).toBe(1);
    expect(form.value_number_relations_second).toBe(3);
  });

  it("flags deprecated sub-filters when any legacy slice is active", () => {
    const filter = buildRelationsFilter({
      date_filter_active: true,
    });

    const form = mapRelationshipsFilterToFormValue(filter);

    expect(form.hadDeprecatedSubFiltersAtHydration).toBe(true);
  });

  it("preserves smartlist and id", () => {
    const filter = buildRelationsFilter();
    const form = mapRelationshipsFilterToFormValue(filter);

    expect(form.id).toBe(501);
    expect(form.smartlist).toBe(123);
  });
});
