import type { DateTime } from "@bsport/datetime-manipulation";

import type { SeriesClassDraft, SeriesClassDraftFormData } from "#src/types";

type BuildIndividualSeriesClassDraftsParams = {
  createClassDraftId: () => string;
  existingClassDraftId?: string;
  classStartDateTimes: DateTime[];
  formData: SeriesClassDraftFormData;
};

export const getSeriesClassDraftsCount = (classDrafts: SeriesClassDraft[]) =>
  classDrafts.length;

export const buildIndividualSeriesClassDrafts = ({
  createClassDraftId,
  existingClassDraftId,
  classStartDateTimes,
  formData,
}: BuildIndividualSeriesClassDraftsParams): SeriesClassDraft[] => {
  const savedClassStartDateTimes =
    classStartDateTimes.length > 0
      ? classStartDateTimes
      : [formData.startDateTime];

  return savedClassStartDateTimes.map((startDateTime, classDraftIndex) => {
    const classDraftId =
      classDraftIndex === 0 && existingClassDraftId
        ? existingClassDraftId
        : createClassDraftId();

    return {
      id: classDraftId,
      data: {
        ...formData,
        isRecurring: false,
        startDateTime,
      },
    };
  });
};
