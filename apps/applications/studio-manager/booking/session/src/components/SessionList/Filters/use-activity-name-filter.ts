import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";

import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";
import { useSearchActivities } from "#src/hooks/use-search-activities";
import { useSearchableFilterField } from "#src/hooks/useSearchableFilterField";
import { selectSessionFilters, useCalendarStore } from "#src/stores/calendar";
import { extractPersistedFilterIds } from "#src/utils/extract-persisted-filter-ids";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useActivityNameFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const filters = useCalendarStore(selectSessionFilters);

  const [persistedIds] = useState(() =>
    extractPersistedFilterIds(filters, SessionFilterTypes.ACTIVITY_NAME),
  );

  const { data: persistedActivities } = useFetchActivitiesByIds(
    persistedIds,
    true,
    {
      select: (data) =>
        data.results.map((activity) => ({
          id: `${activity.id}`,
          label: activity?.name,
        })) || [],
    },
  );

  return useSearchableFilterField({
    filterType: SessionFilterTypes.ACTIVITY_NAME,
    availableFilters: [SessionFilters.FILTER_IS],
    label: t("table.filters.activityName.label"),
    searchPlaceholder: t("table.filters.searchPlaceholder"),
    multiSelect: true,
    persistedItems: persistedActivities,
    useSearch: (query) => useSearchActivities(query),
  });
};
