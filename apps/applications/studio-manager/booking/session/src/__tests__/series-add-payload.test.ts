import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

import { buildPrepareAddGroupSessionsCreationPayload } from "#src/components/series-add/series-add-payload";
import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";
import type { SeriesClassDraft, SeriesClassDraftFormData } from "#src/types";
import type { SeriesDetailsFormData } from "#src/utils/series-details-form";

const TIME_ZONE = "Europe/Paris";

const createDateTime = (isoDate: string) =>
  fromIsoString(isoDate, { zone: TIME_ZONE });

const createSeriesDetails = (
  overrides: Partial<SeriesDetailsFormData> = {},
): SeriesDetailsFormData => ({
  blacklist_tags: [5],
  bookingRule: "fullSeries",
  level: 6,
  manager_only: false,
  name: " Morning series ",
  whitelist_tags: [7],
  ...overrides,
});

const createClassDraft = ({
  dataOverrides = {},
  draftId = "draft-1",
  occurrenceIsoDates = ["2026-06-18T08:00:00+02:00"],
}: {
  dataOverrides?: Partial<SeriesClassDraftFormData>;
  draftId?: string;
  occurrenceIsoDates?: string[];
} = {}): SeriesClassDraft => {
  const data: SeriesClassDraftFormData = {
    coach: 21,
    coach_payment_rule: 8,
    credits: 2,
    duration_minute: 75,
    effectif: 12,
    establishment: 3,
    isRecurring: false,
    recurrenceEndDate: createDateTime("2026-06-19T00:00:00+02:00"),
    recurrenceInterval: 1,
    recurrencePattern: MonthlyRecurrencePattern.NTH_WEEKDAY,
    recurrenceType: RecurrenceType.WEEKLY,
    recurrenceUnit: CustomRecurrenceUnit.DAYS,
    recurrenceWeekdays: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
    },
    room_blueprint: 4,
    roomBlueprintCapacity: null,
    startDateTime: createDateTime("2026-06-18T08:00:00+02:00"),
    ...dataOverrides,
  };

  return {
    id: draftId,
    data,
    occurrences: occurrenceIsoDates.map(
      (occurrenceIsoDate, occurrenceIndex) => ({
        id: `${draftId}-occurrence-${occurrenceIndex + 1}`,
        startDateTime: createDateTime(occurrenceIsoDate),
      }),
    ),
  };
};

describe("series-add-payload", () => {
  it("builds the prepare payload from the series details and class draft", () => {
    const classDraft = createClassDraft();
    const occurrenceStartDateTime = classDraft.occurrences[0].startDateTime;

    const payload = buildPrepareAddGroupSessionsCreationPayload({
      classDrafts: [classDraft],
      selectedService: { id: 12 },
      seriesDetails: createSeriesDetails(),
    });

    expect(payload.group_data).toMatchObject({
      allow_booking_after_start: false,
      available: true,
      full_booking_only: true,
      level: 6,
      manager_only: false,
      meta_activity: 12,
      name: "Morning series",
    });
    expect(payload.recurrence_rule).toBeNull();
    expect(payload.offers_data).toHaveLength(1);
    expect(payload.offers_data[0]).toMatchObject({
      allow_guest_offer: false,
      available: true,
      available_on_partnership: false,
      blacklist_tags: [5],
      broadcast_link: "",
      coach: 21,
      coach_payment_rule: 8,
      credits: 2,
      duration_minute: 75,
      effectif: 12,
      establishment: 3,
      level: 6,
      manager_only: false,
      meta_activity: 12,
      partner_max_booking_count: 0,
      room_blueprint: 4,
      waiting_list_max_size: 0,
      whitelist_tags: [7],
    });
    expect(payload.offers_data[0].date_start).toBe(
      Math.floor(occurrenceStartDateTime.toSeconds()),
    );
  });

  it("expands draft occurrences and sorts every generated class chronologically", () => {
    const payload = buildPrepareAddGroupSessionsCreationPayload({
      classDrafts: [
        createClassDraft({
          draftId: "draft-1",
          occurrenceIsoDates: [
            "2026-06-25T08:00:00+02:00",
            "2026-06-18T08:00:00+02:00",
          ],
        }),
        createClassDraft({
          draftId: "draft-2",
          occurrenceIsoDates: ["2026-06-20T10:00:00+02:00"],
        }),
      ],
      selectedService: { id: 12 },
      seriesDetails: createSeriesDetails(),
    });

    expect(payload.offers_data.map((offer) => offer.date_start)).toEqual([
      Math.floor(createDateTime("2026-06-18T08:00:00+02:00").toSeconds()),
      Math.floor(createDateTime("2026-06-20T10:00:00+02:00").toSeconds()),
      Math.floor(createDateTime("2026-06-25T08:00:00+02:00").toSeconds()),
    ]);
  });

  it("maps the three series booking rules to backend group fields", () => {
    const classDraft = createClassDraft();

    expect(
      buildPrepareAddGroupSessionsCreationPayload({
        classDrafts: [classDraft],
        selectedService: { id: 12 },
        seriesDetails: createSeriesDetails({ bookingRule: "fullSeries" }),
      }).group_data,
    ).toMatchObject({
      allow_booking_after_start: false,
      full_booking_only: true,
    });
    expect(
      buildPrepareAddGroupSessionsCreationPayload({
        classDrafts: [classDraft],
        selectedService: { id: 12 },
        seriesDetails: createSeriesDetails({ bookingRule: "openSeries" }),
      }).group_data,
    ).toMatchObject({
      allow_booking_after_start: true,
      full_booking_only: true,
    });
    expect(
      buildPrepareAddGroupSessionsCreationPayload({
        classDrafts: [classDraft],
        selectedService: { id: 12 },
        seriesDetails: createSeriesDetails({ bookingRule: "singleClass" }),
      }).group_data,
    ).toMatchObject({
      allow_booking_after_start: true,
      full_booking_only: false,
    });
  });

  it("rejects a series without saved class occurrences", () => {
    expect(() =>
      buildPrepareAddGroupSessionsCreationPayload({
        classDrafts: [],
        selectedService: { id: 12 },
        seriesDetails: createSeriesDetails(),
      }),
    ).toThrow("Cannot create a series without classes.");
  });
});
