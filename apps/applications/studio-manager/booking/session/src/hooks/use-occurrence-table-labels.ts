import { useMemo } from "react";

import { useTranslation } from "#src/utils/i18n";

export const useOccurrenceTableLabels = () => {
  const { t } = useTranslation("sessionManagement");

  return useMemo(
    () => ({
      date: t("pageTabs.allOccurrencesTable.date"),
      time: t("pageTabs.allOccurrencesTable.time"),
      participants: t("pageTabs.allOccurrencesTable.participants"),
      teacher: t("pageTabs.allOccurrencesTable.teacher"),
      establishment: t("pageTabs.allOccurrencesTable.establishment"),
      status: t("pageTabs.allOccurrencesTable.status"),
      openSession: t("pageTabs.allOccurrencesTable.openSession"),
      thisClass: t("bookingFlow.confirmation.thisClass"),
      empty: t("pageTabs.allOccurrencesTable.empty"),
    }),
    [t],
  );
};
