import { z } from "zod";

import type { Session, UpdateGroupSessionPayload } from "@bsport/api-book";

import { DEFAULT_LEVEL_ID } from "#src/hooks/level/constants";
import type { Series } from "#src/types";
import {
  type SeriesBookingRule,
  getSeriesBookingRule,
} from "#src/utils/series-booking-rule";
import { sortSeriesClassesByDateStart } from "#src/utils/series-class-dates";

export const SERIES_DETAILS_BOOKING_RULES = [
  "fullSeries",
  "openSeries",
  "singleClass",
] as const satisfies SeriesBookingRule[];

export type SeriesDetailsBookingRule =
  (typeof SERIES_DETAILS_BOOKING_RULES)[number];

export type SeriesDetailsFormData = {
  blacklist_tags: number[];
  bookingRule: SeriesDetailsBookingRule;
  level: number;
  manager_only: boolean;
  name: string;
  whitelist_tags: number[];
};

export type SeriesDetailsFormSchema = z.ZodType<SeriesDetailsFormData>;

const hasSharedTagIds = ({
  blacklist_tags,
  whitelist_tags,
}: Pick<SeriesDetailsFormData, "blacklist_tags" | "whitelist_tags">) => {
  const whitelistTagIdsSet = new Set(whitelist_tags);

  return blacklist_tags.some((tagId) => whitelistTagIdsSet.has(tagId));
};

export const buildSeriesDetailsFormSchema = ({
  nameRequired,
  tagsMutuallyExclusive,
}: {
  nameRequired: string;
  tagsMutuallyExclusive: string;
}): SeriesDetailsFormSchema =>
  z
    .object({
      blacklist_tags: z.array(z.number()),
      bookingRule: z.enum(SERIES_DETAILS_BOOKING_RULES),
      level: z.number().int().positive(),
      manager_only: z.boolean(),
      name: z
        .string({
          invalid_type_error: nameRequired,
          required_error: nameRequired,
        })
        .trim()
        .min(1, { message: nameRequired }),
      whitelist_tags: z.array(z.number()),
    })
    .superRefine((values, context) => {
      if (!hasSharedTagIds(values)) {
        return;
      }

      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: tagsMutuallyExclusive,
        path: ["blacklist_tags"],
      });
    });

export const DEFAULT_SERIES_DETAILS_FORM_VALUES: SeriesDetailsFormData = {
  blacklist_tags: [],
  bookingRule: "fullSeries",
  level: DEFAULT_LEVEL_ID,
  manager_only: false,
  name: "",
  whitelist_tags: [],
};

type SeriesDetailsClassTags = Pick<
  Session,
  "blacklist_tags" | "date_start" | "whitelist_tags"
>;

export const getSeriesDetailsInitialValues = ({
  classes,
  series,
}: {
  classes: SeriesDetailsClassTags[];
  series: Pick<
    Series,
    | "allow_booking_after_start"
    | "full_booking_only"
    | "level"
    | "manager_only"
    | "name"
  >;
}): SeriesDetailsFormData => {
  const firstClass = sortSeriesClassesByDateStart(classes).at(0);

  return {
    blacklist_tags: firstClass?.blacklist_tags ?? [],
    bookingRule: getSeriesBookingRule(series),
    level: series.level,
    manager_only: series.manager_only,
    name: series.name,
    whitelist_tags: firstClass?.whitelist_tags ?? [],
  };
};

export const getSeriesBookingRulePayloadFields = (
  bookingRule: SeriesBookingRule,
): Required<
  Pick<
    UpdateGroupSessionPayload,
    "allow_booking_after_start" | "full_booking_only"
  >
> => {
  if (bookingRule === "fullSeries") {
    return {
      allow_booking_after_start: false,
      full_booking_only: true,
    };
  }

  if (bookingRule === "openSeries") {
    return {
      allow_booking_after_start: true,
      full_booking_only: true,
    };
  }

  return {
    allow_booking_after_start: true,
    full_booking_only: false,
  };
};

export const buildSeriesDetailsPayload = (
  values: SeriesDetailsFormData,
): UpdateGroupSessionPayload => ({
  ...getSeriesBookingRulePayloadFields(values.bookingRule),
  blacklist_tags: values.blacklist_tags,
  level: values.level,
  manager_only: values.manager_only,
  name: values.name,
  whitelist_tags: values.whitelist_tags,
});
