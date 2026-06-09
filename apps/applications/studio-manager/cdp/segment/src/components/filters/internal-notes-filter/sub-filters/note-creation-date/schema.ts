import { z } from "zod";

import { refineSmartlistDateSubFilter } from "#src/components/filters/shared/smartlist-date-filter/refine-smartlist-date-sub-filter";
import { i18nInstance } from "#src/utils/i18n";

import type { InternalNotesFilterFormValue } from "../../types";
import { INTERNAL_NOTES_SUB_FILTER_IDS } from "../internal-notes-sub-filter-id";

const I18N_NAMESPACE = "sm-smartlists_filters";

/**
 * Conditional validation for the note creation date sub-filter when it is active.
 */
export const refineNoteCreationDateSubFilter = (
  value: InternalNotesFilterFormValue,
  context: z.RefinementCtx,
) => {
  refineSmartlistDateSubFilter({
    isActive: value.subFilters.includes(
      INTERNAL_NOTES_SUB_FILTER_IDS.noteCreationDate,
    ),
    fieldPath: "noteCreationDate",
    dateValue: value.noteCreationDate,
    context,
    messages: {
      dateRequired: i18nInstance.t(
        "filters.104.validation.noteCreationDateRequired",
        { ns: I18N_NAMESPACE },
      ),
      dateBetweenRequired: i18nInstance.t(
        "filters.104.validation.noteCreationDateBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationRequired: i18nInstance.t(
        "filters.104.validation.noteCreationDateDurationRequired",
        { ns: I18N_NAMESPACE },
      ),
      durationBetweenRequired: i18nInstance.t(
        "filters.104.validation.noteCreationDateDurationBetweenRequired",
        { ns: I18N_NAMESPACE },
      ),
    },
  });
};
