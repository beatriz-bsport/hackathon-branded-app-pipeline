import type {
  GroupSessionOfferPayload,
  PrepareGroupSessionsCreationPayload,
} from "@bsport/api-book";

import { sortSeriesClassesByDateStart } from "#src/utils/series-class-dates";
import { getSeriesDuplicateClassTeacherId } from "#src/utils/series-duplicate-class";
import {
  getSeriesDuplicateDayDelta,
  getShiftedSeriesDuplicateClassDate,
} from "#src/utils/series-duplicate-dates";
import type { SeriesDuplicateFormData } from "#src/utils/series-duplicate-form";
import type {
  SeriesDuplicateClass,
  SeriesDuplicateSeries,
} from "#src/utils/series-duplicate-types";

type BuildPrepareDuplicateGroupSessionsCreationPayloadParams = {
  classes: SeriesDuplicateClass[];
  series: SeriesDuplicateSeries;
  timeZone: string;
  values: SeriesDuplicateFormData;
};

type OptionalSyncOnSpiviPayload = {
  sync_on_spivi?: boolean;
};

type BuildDuplicateOfferPreviewPayloadParams = {
  dayDelta: number;
  optionalSyncOnSpiviPayload: OptionalSyncOnSpiviPayload;
  series: SeriesDuplicateSeries;
  sessionClass: SeriesDuplicateClass;
  timeZone: string;
};

const getOptionalSyncOnSpiviPayload = (
  series: SeriesDuplicateSeries,
): OptionalSyncOnSpiviPayload =>
  typeof series.sync_on_spivi === "boolean"
    ? { sync_on_spivi: series.sync_on_spivi }
    : {};

const buildDuplicateOfferPreviewPayload = ({
  dayDelta,
  optionalSyncOnSpiviPayload,
  series,
  sessionClass,
  timeZone,
}: BuildDuplicateOfferPreviewPayloadParams): GroupSessionOfferPayload => ({
  allow_guest_offer: sessionClass.allow_guest_offer,
  available: true,
  available_on_partnership: sessionClass.available_on_partnership,
  blacklist_tags: [...sessionClass.blacklist_tags],
  broadcast_link: sessionClass.broadcast_link,
  coach: getSeriesDuplicateClassTeacherId(sessionClass),
  coach_payment_rule: sessionClass.coach_payment_rule_id,
  credits: sessionClass.credit_price,
  date_start: Math.floor(
    getShiftedSeriesDuplicateClassDate({
      dateStart: sessionClass.date_start,
      dayDelta,
      timeZone,
    }).toSeconds(),
  ),
  description_override: sessionClass.description_override ?? "",
  duration_minute: sessionClass.duration_minute,
  effectif: sessionClass.effectif,
  establishment: sessionClass.establishment,
  is_hybrid: Boolean(sessionClass.linked_hybrid_offer_id),
  level: series.level,
  manager_only: series.manager_only,
  meta_activity: series.meta_activity,
  name_override: sessionClass.name_override ?? "",
  partner_max_booking_count: sessionClass.partner_max_booking_count,
  partner_spot_capping_strategy: sessionClass.partner_spot_capping_strategy,
  room_blueprint: sessionClass.room_blueprint,
  waiting_list_max_size: sessionClass.waiting_list_max_size,
  whitelist_tags: [...sessionClass.whitelist_tags],
  ...optionalSyncOnSpiviPayload,
});

export const buildPrepareDuplicateGroupSessionsCreationPayload = ({
  classes,
  series,
  timeZone,
  values,
}: BuildPrepareDuplicateGroupSessionsCreationPayloadParams): PrepareGroupSessionsCreationPayload => {
  const sortedClasses = sortSeriesClassesByDateStart(classes);
  const firstClass = sortedClasses.at(0);

  if (!firstClass) {
    throw new Error("Cannot duplicate a series without classes.");
  }

  const dayDelta = getSeriesDuplicateDayDelta({
    originalFirstClassDateStart: firstClass.date_start,
    startDate: values.startDate,
    timeZone,
  });
  const optionalSyncOnSpiviPayload = getOptionalSyncOnSpiviPayload(series);

  return {
    group_data: {
      allow_booking_after_start: series.allow_booking_after_start,
      available: true,
      full_booking_only: series.full_booking_only,
      level: series.level,
      manager_only: series.manager_only,
      meta_activity: series.meta_activity,
      name: values.name.trim(),
      ...optionalSyncOnSpiviPayload,
    },
    // `null` here to mean "do not generate extra recurring groups".
    recurrence_rule: null,
    offers_data: sortedClasses.map((sessionClass) =>
      buildDuplicateOfferPreviewPayload({
        dayDelta,
        optionalSyncOnSpiviPayload,
        series,
        sessionClass,
        timeZone,
      }),
    ),
  };
};
