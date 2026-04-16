import type { FilterField } from "@bsport/kaizen-primitive-core";

import { useLocalFilterField } from "#src/hooks/useLocalFilterField";
import type { EnrichedAppointment } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { AppointmentFilterTypes, AppointmentFilters } from "./types";

const extractPassUsedName = (appt: EnrichedAppointment) => appt.passUsedName;

export const useAppointmentPassUsedFilter = (
  appointments: EnrichedAppointment[],
): FilterField => {
  const { t } = useTranslation("sessionList");

  return useLocalFilterField({
    items: appointments,
    extractValue: extractPassUsedName,
    filterType: AppointmentFilterTypes.PASS_USED,
    availableFilters: [AppointmentFilters.FILTER_IS],
    label: t("appointmentTable.filters.passUsed.label"),
    searchPlaceholder: t("appointmentTable.filters.searchPlaceholder"),
    multiSelect: true,
  });
};
