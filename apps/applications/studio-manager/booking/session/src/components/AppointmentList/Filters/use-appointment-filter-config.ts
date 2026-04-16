import { useCallback, useRef } from "react";

import type {
  FilterElementState,
  FilterProps,
} from "@bsport/kaizen-primitive-core";

import {
  selectAppointmentFilters,
  setFilters,
  useCalendarStore,
} from "#src/stores/calendar";
import type { EnrichedAppointment } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { AppointmentFilterTypes, AppointmentFilters } from "./types";
import { useAppointmentEstablishmentFilter } from "./use-appointment-establishment-filter";
import { useAppointmentNameFilter } from "./use-appointment-name-filter";
import { useAppointmentParticipantFilter } from "./use-appointment-participant-filter";
import { useAppointmentPassUsedFilter } from "./use-appointment-pass-used-filter";
import { useAppointmentTeacherFilter } from "./use-appointment-teacher-filter";

export const useAppointmentFilterConfig = (
  appointments: EnrichedAppointment[],
) => {
  const { t } = useTranslation("sessionList");
  const filters = useCalendarStore(selectAppointmentFilters);
  const filterRef = useRef<{ resetFilters: () => void }>(null);

  const teacherFilter = useAppointmentTeacherFilter();
  const establishmentFilter = useAppointmentEstablishmentFilter();
  const participantFilter = useAppointmentParticipantFilter();
  const nameFilter = useAppointmentNameFilter(appointments);
  const passUsedFilter = useAppointmentPassUsedFilter(appointments);

  const onFilterChange = useCallback((newFilters: FilterElementState[]) => {
    setFilters("appointments", newFilters);
  }, []);

  const filterConfig: FilterProps = {
    fields: {
      [AppointmentFilterTypes.NAME]: nameFilter,
      [AppointmentFilterTypes.TEACHER]: teacherFilter,
      [AppointmentFilterTypes.ESTABLISHMENT]: establishmentFilter,
      [AppointmentFilterTypes.PARTICIPANT]: participantFilter,
      [AppointmentFilterTypes.PASS_USED]: passUsedFilter,
    },
    filters: [
      {
        id: AppointmentFilters.FILTER_IS,
        label: t("appointmentTable.filters.is"),
      },
    ],
    selectFieldLabel: t("appointmentTable.filters.label"),
    onFilterChange,
    defaultFilters: filters,
  };

  return {
    filterConfig,
    resetFilters: () => filterRef.current?.resetFilters?.(),
    appointmentFiltersRef: filterRef,
  };
};
