import type { SeriesClassDraft } from "#src/types";

export const getSeriesClassDraftsOccurrencesCount = (
  classDrafts: SeriesClassDraft[],
) =>
  classDrafts.reduce(
    (occurrencesCount, classDraft) =>
      occurrencesCount + classDraft.occurrences.length,
    0,
  );
