import { useMemo } from "react";

import { useTranslation } from "#src/utils/i18n";

/**
 * Which `pageTabs.<X>` i18n block supplies a table's column + empty-state
 * strings. The series and all-occurrences tables are structurally identical and
 * differ only in their data source and a couple of label strings, so the page
 * tells the table which label block to read. Kept as a discriminator (rather
 * than passing a resolved labels object) so this hook stays the single owner of
 * label construction and `t` keys remain static for type-checking.
 */
export type OccurrenceLabelGroup = "seriesTable" | "allOccurrencesTable";

/** Resolve the per-tab column/empty labels with static (type-checked) keys. */
export const useOccurrenceTableLabels = (labelGroup: OccurrenceLabelGroup) => {
  const { t } = useTranslation("sessionManagement");

  return useMemo(
    () =>
      labelGroup === "seriesTable"
        ? {
            date: t("pageTabs.seriesTable.date"),
            time: t("pageTabs.seriesTable.time"),
            participants: t("pageTabs.seriesTable.participants"),
            teacher: t("pageTabs.seriesTable.teacher"),
            establishment: t("pageTabs.seriesTable.establishment"),
            status: t("pageTabs.seriesTable.status"),
            openSession: t("pageTabs.seriesTable.openSession"),
            empty: t("pageTabs.seriesTable.empty"),
          }
        : {
            date: t("pageTabs.allOccurrencesTable.date"),
            time: t("pageTabs.allOccurrencesTable.time"),
            participants: t("pageTabs.allOccurrencesTable.participants"),
            teacher: t("pageTabs.allOccurrencesTable.teacher"),
            establishment: t("pageTabs.allOccurrencesTable.establishment"),
            status: t("pageTabs.allOccurrencesTable.status"),
            openSession: t("pageTabs.allOccurrencesTable.openSession"),
            empty: t("pageTabs.allOccurrencesTable.empty"),
          },
    [t, labelGroup],
  );
};
