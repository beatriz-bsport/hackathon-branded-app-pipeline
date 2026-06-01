import { describe, expect, it } from "vitest";

import {
  isBookingMilestoneFilter,
  isFirstPurchaseFilter,
  isPaymentPackFilter,
  isPrivateBookingsFilter,
  isTagFilter,
  isTotalBookingFilter,
} from "#src/components/filters/shared/types-guards";

describe("smartlist filter type guards", () => {
  it("accepts payment pack filters by filter_identifier", () => {
    expect(
      isPaymentPackFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 19,
        has_pack: true,
        select_all_payment_packs: false,
        payment_packs: [1, 2],
      }),
    ).toBe(true);
  });

  it("rejects payment pack shape when filter_identifier does not match", () => {
    expect(
      isPaymentPackFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 22,
        has_pack: true,
        select_all_payment_packs: false,
        payment_packs: [1, 2],
      }),
    ).toBe(false);
  });

  it("accepts total booking filters by filter_identifier", () => {
    expect(
      isTotalBookingFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 22,
        comparator: 2,
        value: 3,
        value_second: 0,
      }),
    ).toBe(true);
  });

  it("rejects total booking shape when filter_identifier is booking milestone", () => {
    expect(
      isTotalBookingFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 21,
        comparator: 2,
        value: 3,
        value_second: 0,
      }),
    ).toBe(false);
  });

  it("accepts private bookings filters by filter_identifier", () => {
    expect(
      isPrivateBookingsFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 26,
        comparator: 2,
        value: 3,
        value_second: 0,
      }),
    ).toBe(true);
  });

  it("rejects private bookings shape when filter_identifier is total booking", () => {
    expect(
      isPrivateBookingsFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 22,
        comparator: 2,
        value: 3,
        value_second: 0,
      }),
    ).toBe(false);
  });

  it("accepts tag filters by filter_identifier", () => {
    expect(
      isTagFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 11,
        tags_included: [1],
        tags_excluded: [],
      }),
    ).toBe(true);
  });

  it("accepts booking milestone filters by filter_identifier", () => {
    expect(
      isBookingMilestoneFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 21,
        value: 5,
      }),
    ).toBe(true);
  });

  it("rejects booking milestone shape when filter_identifier is total booking", () => {
    expect(
      isBookingMilestoneFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 22,
        value: 5,
      }),
    ).toBe(false);
  });

  it("accepts first purchase filters by filter_identifier", () => {
    expect(
      isFirstPurchaseFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 28,
        first_payment_is_done: true,
      }),
    ).toBe(true);
  });

  it("rejects first purchase shape when filter_identifier does not match", () => {
    expect(
      isFirstPurchaseFilter({
        id: 1,
        smartlist: 1,
        company_id: 1,
        filter_identifier: 19,
        first_payment_is_done: true,
      }),
    ).toBe(false);
  });
});
