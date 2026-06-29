import { describe, expect, it } from "vitest";

import { fromIsoString } from "@bsport/datetime-manipulation";

import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";
import type { SeriesClassDraftFormData } from "#src/types";
import {
  buildIndividualSeriesClassDrafts,
  getSeriesClassDraftsCount,
} from "#src/utils/series-class-draft";

const TIME_ZONE = "Europe/Paris";
const PACIFIC_TIME_ZONE = "Pacific/Chatham";

const createDateTime = (isoDate: string, zone = TIME_ZONE) =>
  fromIsoString(isoDate, { zone });

const createClassDraftFormData = (
  overrides: Partial<SeriesClassDraftFormData> = {},
): SeriesClassDraftFormData => ({
  coach: 21,
  coach_payment_rule: 8,
  credits: 2,
  duration_minute: 75,
  effectif: 12,
  establishment: 3,
  isRecurring: true,
  recurrenceEndDate: createDateTime("2026-06-25T00:00:00+02:00"),
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
  ...overrides,
});

const createClassDraftIdFactory = () => {
  let nextClassDraftNumber = 0;

  return () => {
    nextClassDraftNumber += 1;
    return `series-class-draft-${nextClassDraftNumber}`;
  };
};

describe("series-class-draft", () => {
  describe("buildIndividualSeriesClassDrafts", () => {
    it("flattens recurrence dates into separate class drafts", () => {
      const classStartDateTimes = [
        createDateTime("2026-06-18T08:00:00+02:00"),
        createDateTime("2026-06-25T08:00:00+02:00"),
      ];

      const drafts = buildIndividualSeriesClassDrafts({
        createClassDraftId: createClassDraftIdFactory(),
        classStartDateTimes,
        formData: createClassDraftFormData(),
      });

      expect(drafts).toHaveLength(2);
      expect(drafts.map((draft) => draft.id)).toEqual([
        "series-class-draft-1",
        "series-class-draft-2",
      ]);
      expect(drafts.map((draft) => draft.data.isRecurring)).toEqual([
        false,
        false,
      ]);
      expect(drafts.map((draft) => draft.data.startDateTime)).toEqual(
        classStartDateTimes,
      );
      expect(getSeriesClassDraftsCount(drafts)).toBe(2);
    });

    it("keeps the edited draft id for the first generated class", () => {
      const classStartDateTimes = [
        createDateTime("2026-06-18T08:00:00+02:00"),
        createDateTime("2026-06-25T08:00:00+02:00"),
      ];

      const drafts = buildIndividualSeriesClassDrafts({
        createClassDraftId: createClassDraftIdFactory(),
        existingClassDraftId: "series-class-draft-existing",
        classStartDateTimes,
        formData: createClassDraftFormData(),
      });

      expect(drafts.map((draft) => draft.id)).toEqual([
        "series-class-draft-existing",
        "series-class-draft-1",
      ]);
      expect(drafts[0].data.startDateTime).toEqual(classStartDateTimes[0]);
    });

    it("preserves Pacific timezone dates when flattening recurrence drafts", () => {
      const classStartDateTimes = [
        createDateTime("2025-03-30T08:00:00", PACIFIC_TIME_ZONE),
        createDateTime("2025-04-06T08:00:00", PACIFIC_TIME_ZONE),
      ];

      const drafts = buildIndividualSeriesClassDrafts({
        createClassDraftId: createClassDraftIdFactory(),
        classStartDateTimes,
        formData: createClassDraftFormData({
          recurrenceEndDate: createDateTime(
            "2025-04-06T00:00:00",
            PACIFIC_TIME_ZONE,
          ),
          startDateTime: classStartDateTimes[0],
        }),
      });

      expect(drafts.map((draft) => draft.id)).toEqual([
        "series-class-draft-1",
        "series-class-draft-2",
      ]);
      expect(
        drafts.map((draft) => draft.data.startDateTime.toISODate()),
      ).toEqual(["2025-03-30", "2025-04-06"]);
      expect(drafts.map((draft) => draft.data.startDateTime.zoneName)).toEqual([
        PACIFIC_TIME_ZONE,
        PACIFIC_TIME_ZONE,
      ]);
      expect(drafts.map((draft) => draft.data.startDateTime.offset)).toEqual([
        825, 765,
      ]);
    });

    it("falls back to the submitted start date when recurrence generation returns no dates", () => {
      const formData = createClassDraftFormData({
        startDateTime: createDateTime("2026-06-18T09:30:00+02:00"),
      });

      const drafts = buildIndividualSeriesClassDrafts({
        createClassDraftId: createClassDraftIdFactory(),
        classStartDateTimes: [],
        formData,
      });

      expect(drafts).toHaveLength(1);
      expect(drafts[0]).toMatchObject({
        id: "series-class-draft-1",
        data: {
          isRecurring: false,
          startDateTime: formData.startDateTime,
        },
      });
    });
  });
});
