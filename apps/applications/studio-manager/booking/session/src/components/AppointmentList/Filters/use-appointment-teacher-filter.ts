import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSearchTeachers } from "#src/hooks/use-search-teachers";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";
import { useSearchableFilterField } from "#src/hooks/useSearchableFilterField";
import {
  selectAppointmentFilters,
  useCalendarStore,
} from "#src/stores/calendar";
import { extractPersistedFilterIds } from "#src/utils/extract-persisted-filter-ids";
import { useTranslation } from "#src/utils/i18n";

import {
  AppointmentFilterTypes,
  AppointmentFilters,
  NO_VALUE_FILTER_ID,
} from "./types";

export const useAppointmentTeacherFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const filters = useCalendarStore(selectAppointmentFilters);
  const restrictedTeachers = dataAccessLayer.useUserRestrictedTeachers();
  const restrictParams =
    restrictedTeachers.length > 0 ? { id__in: restrictedTeachers } : {};

  const [persistedIds] = useState(() =>
    extractPersistedFilterIds(filters, AppointmentFilterTypes.TEACHER),
  );
  const persistedTeacherIds =
    restrictedTeachers.length > 0
      ? persistedIds.filter((id) => restrictedTeachers.includes(id))
      : persistedIds;

  const { data: persistedTeachers } = useFetchTeachers(
    persistedTeacherIds,
    true,
    {},
    (teachers) =>
      teachers?.map((teacher) => ({
        id: `${teacher.id}`,
        label: teacher.name,
      })) || [],
  );

  return useSearchableFilterField({
    filterType: AppointmentFilterTypes.TEACHER,
    availableFilters: [AppointmentFilters.FILTER_IS],
    label: t("appointmentTable.filters.teacher.label"),
    searchPlaceholder: t("appointmentTable.filters.searchPlaceholder"),
    multiSelect: true,
    pinnedItems:
      restrictedTeachers.length > 0
        ? []
        : [{ id: NO_VALUE_FILTER_ID, label: t("appointmentTable.noTeacher") }],
    persistedItems: persistedTeachers,
    useSearch: (query) => useSearchTeachers(query, restrictParams),
  });
};
