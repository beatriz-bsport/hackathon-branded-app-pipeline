import type {
  GroupSessionOfferPayload,
  MetaActivity,
  PrepareGroupSessionsCreationPayload,
} from "@bsport/api-book";

import type { SeriesClassDraft, SeriesClassDraftOccurrence } from "#src/types";
import {
  type SeriesDetailsFormData,
  getSeriesBookingRulePayloadFields,
} from "#src/utils/series-details-form";

type BuildPrepareAddGroupSessionsCreationPayloadParams = {
  classDrafts: SeriesClassDraft[];
  selectedService: Pick<MetaActivity, "id">;
  seriesDetails: SeriesDetailsFormData;
};

type SeriesClassDraftOccurrenceWithDraft = {
  draft: SeriesClassDraft;
  occurrence: SeriesClassDraftOccurrence;
};

const getRequiredNumber = (value: number | null, fieldName: string) => {
  if (value === null) {
    throw new Error(`Cannot create a series class without ${fieldName}.`);
  }

  return value;
};

const getSortedClassDraftOccurrences = (
  classDrafts: SeriesClassDraft[],
): SeriesClassDraftOccurrenceWithDraft[] =>
  classDrafts
    .flatMap((draft) =>
      draft.occurrences.map((occurrence) => ({
        draft,
        occurrence,
      })),
    )
    .sort(
      (firstDraftOccurrence, secondDraftOccurrence) =>
        firstDraftOccurrence.occurrence.startDateTime.toMillis() -
        secondDraftOccurrence.occurrence.startDateTime.toMillis(),
    );

// Maps one saved class occurrence to the offer shape expected by
// generate_preview before final group creation.
const buildAddSeriesOfferPreviewPayload = ({
  draft,
  occurrence,
  selectedService,
  seriesDetails,
}: SeriesClassDraftOccurrenceWithDraft &
  Pick<
    BuildPrepareAddGroupSessionsCreationPayloadParams,
    "selectedService" | "seriesDetails"
  >): GroupSessionOfferPayload => ({
  allow_guest_offer: false,
  available: true,
  available_on_partnership: false,
  blacklist_tags: [...seriesDetails.blacklist_tags],
  broadcast_link: "",
  coach: getRequiredNumber(draft.data.coach, "teacher"),
  coach_payment_rule: draft.data.coach_payment_rule,
  credits: draft.data.credits,
  date_start: Math.floor(occurrence.startDateTime.toSeconds()),
  duration_minute: draft.data.duration_minute,
  effectif: draft.data.effectif,
  establishment: getRequiredNumber(draft.data.establishment, "establishment"),
  level: seriesDetails.level,
  manager_only: seriesDetails.manager_only,
  meta_activity: selectedService.id,
  partner_max_booking_count: 0,
  room_blueprint: draft.data.room_blueprint,
  waiting_list_max_size: 0,
  whitelist_tags: [...seriesDetails.whitelist_tags],
});

// Builds the full generate_preview payload from the selected service, series
// details, and all saved local class occurrences.
export const buildPrepareAddGroupSessionsCreationPayload = ({
  classDrafts,
  selectedService,
  seriesDetails,
}: BuildPrepareAddGroupSessionsCreationPayloadParams): PrepareGroupSessionsCreationPayload => {
  const sortedClassDraftOccurrences =
    getSortedClassDraftOccurrences(classDrafts);

  if (sortedClassDraftOccurrences.length === 0) {
    throw new Error("Cannot create a series without classes.");
  }

  return {
    group_data: {
      ...getSeriesBookingRulePayloadFields(seriesDetails.bookingRule),
      available: true,
      level: seriesDetails.level,
      manager_only: seriesDetails.manager_only,
      meta_activity: selectedService.id,
      name: seriesDetails.name.trim(),
    },
    // Class recurrence is expanded locally into individual offers. Keeping this
    // null prevents backend creation of repeated series groups.
    recurrence_rule: null,
    offers_data: sortedClassDraftOccurrences.map((draftOccurrence) =>
      buildAddSeriesOfferPreviewPayload({
        ...draftOccurrence,
        selectedService,
        seriesDetails,
      }),
    ),
  };
};
