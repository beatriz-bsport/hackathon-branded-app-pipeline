import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

import { buildPrepareDuplicateGroupSessionsCreationPayload } from "#src/utils/series-duplicate-payload";
import type { SeriesDuplicateClass } from "#src/utils/series-duplicate-types";
import { normalizePreparedGroupSessionsForCreation } from "#src/utils/series-group-session-creation-payload";

const TIME_ZONE = "Europe/Paris";

const createSeries = () => ({
  allow_booking_after_start: false,
  full_booking_only: true,
  level: 5,
  manager_only: true,
  meta_activity: 12,
  name: "Meditation series",
  sync_on_spivi: true,
});

const createClass = (
  overrides: Partial<SeriesDuplicateClass> = {},
): SeriesDuplicateClass => ({
  allow_guest_offer: false,
  available_on_partnership: true,
  blacklist_tags: [1],
  broadcast_link: "https://example.com/live",
  coach: 21,
  coach_override: null,
  coach_payment_rule_id: 8,
  credit_price: 2,
  date_start: "2026-06-16T09:00:00+02:00",
  description_override: "Bring a mat",
  duration_minute: 60,
  effectif: 10,
  establishment: 3,
  linked_hybrid_offer_id: null,
  name_override: "",
  partner_max_booking_count: 0,
  partner_spot_capping_strategy: undefined,
  room_blueprint: null,
  waiting_list_max_size: 0,
  whitelist_tags: [2],
  ...overrides,
});

describe("series-duplicate", () => {
  it("builds preview payload with copied group fields and shifted class dates", () => {
    const payload = buildPrepareDuplicateGroupSessionsCreationPayload({
      classes: [
        createClass({
          coach: 21,
          coach_override: 22,
          date_start: "2026-06-16T09:00:00+02:00",
        }),
      ],
      series: createSeries(),
      timeZone: TIME_ZONE,
      values: {
        name: " Meditation copy ",
        startDate: fromIsoString("2026-06-23T00:00:00+02:00", {
          zone: TIME_ZONE,
        }),
      },
    });

    expect(payload.group_data).toMatchObject({
      allow_booking_after_start: false,
      available: true,
      full_booking_only: true,
      level: 5,
      manager_only: true,
      meta_activity: 12,
      name: "Meditation copy",
      sync_on_spivi: true,
    });
    expect(payload.recurrence_rule).toBeNull();
    expect(payload.offers_data).toHaveLength(1);
    expect(payload.offers_data[0]).toMatchObject({
      available: true,
      coach: 22,
      coach_payment_rule: 8,
      credits: 2,
      level: 5,
      manager_only: true,
      meta_activity: 12,
      sync_on_spivi: true,
    });
    expect(payload.offers_data[0].date_start).toBe(
      Math.floor(
        fromIsoString("2026-06-23T09:00:00+02:00", {
          zone: TIME_ZONE,
        }).toSeconds(),
      ),
    );
  });

  it("normalizes preview groups before final creation", () => {
    const previewGroup = {
      ...createSeries(),
      available: true,
      company: 1,
      first_offer_date: "2026-06-23",
      last_offer_date: "2026-06-30",
      id: 99,
      offers: [10],
      recurrence_id: "source-recurrence",
      recurrence_index: 1,
      recurrence_rule: { count: 1 },
    };

    const createPayload = normalizePreparedGroupSessionsForCreation({
      0: {
        group: previewGroup,
        offers_data: [
          {
            ...createClass(),
            coach_payment_rule: 8,
            credits: 2,
            date_start: 1782205200,
            id: 10,
            level: 5,
            manager_only: true,
            meta_activity: 12,
          },
          {
            ...createClass({ coach_payment_rule_id: null }),
            coach_payment_rule: null,
            credits: 2,
            date_start: 1782291600,
            id: 11,
            level: 5,
            manager_only: true,
            meta_activity: 12,
          },
        ],
      },
    });
    const normalizedGroup = createPayload.group_data_with_offers[0].group;
    const normalizedFirstOffer =
      createPayload.group_data_with_offers[0].offers_data[0];
    const normalizedSecondOffer =
      createPayload.group_data_with_offers[0].offers_data[1];

    expect(normalizedGroup).not.toHaveProperty("id");
    expect(normalizedGroup).not.toHaveProperty("offers");
    expect(normalizedGroup).not.toHaveProperty("first_offer_date");
    expect(normalizedGroup).not.toHaveProperty("last_offer_date");
    expect(normalizedGroup).not.toHaveProperty("recurrence_id");
    expect(normalizedGroup).not.toHaveProperty("recurrence_rule");
    expect(normalizedFirstOffer).not.toHaveProperty("id");
    expect(normalizedFirstOffer).not.toHaveProperty("coach_payment_rule");
    expect(normalizedFirstOffer.coach_payment_rule_id).toBe(8);
    expect(normalizedFirstOffer.available).toBe(true);
    expect(normalizedSecondOffer).not.toHaveProperty("coach_payment_rule");
    expect(normalizedSecondOffer.coach_payment_rule_id).toBeNull();
  });
});
