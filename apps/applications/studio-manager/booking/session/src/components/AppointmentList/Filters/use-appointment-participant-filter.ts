import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";

import { useFetchMembersByIds } from "#src/hooks/appointment/fetch/useFetchMembersByIds";
import { useSearchMembersForFilter } from "#src/hooks/appointment/fetch/useSearchMembersForFilter";
import { useSearchableFilterField } from "#src/hooks/useSearchableFilterField";
import {
  selectAppointmentFilters,
  useCalendarStore,
} from "#src/stores/calendar";
import { extractPersistedFilterIds } from "#src/utils/extract-persisted-filter-ids";
import { useTranslation } from "#src/utils/i18n";

import { AppointmentFilterTypes, AppointmentFilters } from "./types";

export const useAppointmentParticipantFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const filters = useCalendarStore(selectAppointmentFilters);

  const [persistedIds] = useState(() =>
    extractPersistedFilterIds(filters, AppointmentFilterTypes.PARTICIPANT),
  );

  const { data: persistedMembers } = useFetchMembersByIds(
    persistedIds,
    true,
    (members) =>
      members?.map((member) => ({
        id: `${member.id}`,
        label: member.name,
      })) || [],
  );

  return useSearchableFilterField({
    filterType: AppointmentFilterTypes.PARTICIPANT,
    availableFilters: [AppointmentFilters.FILTER_IS],
    label: t("appointmentTable.filters.participant.label"),
    searchPlaceholder: t("appointmentTable.filters.searchPlaceholder"),
    multiSelect: true,
    persistedItems: persistedMembers,
    useSearch: (query) => useSearchMembersForFilter(query),
  });
};
