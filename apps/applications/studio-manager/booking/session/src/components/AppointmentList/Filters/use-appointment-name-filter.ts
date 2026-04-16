import type { FilterField } from "@bsport/kaizen-primitive-core";

import { useLocalFilterField } from "#src/hooks/useLocalFilterField";
import type { EnrichedAppointment } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { AppointmentFilterTypes, AppointmentFilters } from "./types";

const extractName = (appt: EnrichedAppointment) => appt.name;

export const useAppointmentNameFilter = (
  appointments: EnrichedAppointment[],
): FilterField => {
  const { t } = useTranslation("sessionList");

  return useLocalFilterField({
    items: appointments,
    extractValue: extractName,
    filterType: AppointmentFilterTypes.NAME,
    availableFilters: [AppointmentFilters.FILTER_IS],
    label: t("appointmentTable.filters.name.label"),
    searchPlaceholder: t("appointmentTable.filters.searchPlaceholder"),
    multiSelect: true,
  });
};
