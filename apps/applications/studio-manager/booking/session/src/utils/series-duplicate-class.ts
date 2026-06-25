import type { SeriesDuplicateClass } from "#src/utils/series-duplicate-types";

export const getSeriesDuplicateClassTeacherId = (
  sessionClass: Pick<SeriesDuplicateClass, "coach" | "coach_override">,
) => sessionClass.coach_override ?? sessionClass.coach;
