import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSearchTeachers } from "#src/hooks/use-search-teachers";
import { useFetchTeachers } from "#src/hooks/useFetchTeachers";
import { useSearchableFilterField } from "#src/hooks/useSearchableFilterField";
import { selectSessionFilters, useCalendarStore } from "#src/stores/calendar";
import { extractPersistedFilterIds } from "#src/utils/extract-persisted-filter-ids";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useTeacherFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const filters = useCalendarStore(selectSessionFilters);
  const restrictedTeachers = dataAccessLayer.useUserRestrictedTeachers();
  const restrictParams =
    restrictedTeachers.length > 0 ? { id__in: restrictedTeachers } : {};

  // Freeze persisted IDs on mount — only need to fetch initial selections once
  const [persistedIds] = useState(() =>
    extractPersistedFilterIds(filters, SessionFilterTypes.TEACHER),
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
    filterType: SessionFilterTypes.TEACHER,
    availableFilters: [SessionFilters.FILTER_IS, SessionFilters.FILTER_NOT],
    label: t("table.filters.teacher.label"),
    searchPlaceholder: t("table.filters.searchPlaceholder"),
    multiSelect: true,
    persistedItems: persistedTeachers,
    useSearch: (query) => useSearchTeachers(query, restrictParams),
  });
};
