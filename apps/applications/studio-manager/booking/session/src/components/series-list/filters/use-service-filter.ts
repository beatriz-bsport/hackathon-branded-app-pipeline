import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";

import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";
import {
  selectWorkshopActivityFilterItems,
  useSearchWorkshopActivities,
} from "#src/hooks/use-search-workshop-activities";
import { useSearchableFilterField } from "#src/hooks/useSearchableFilterField";
import { selectSeriesFilters, useCalendarStore } from "#src/stores/calendar";
import { extractPersistedFilterIds } from "#src/utils/extract-persisted-filter-ids";
import { useTranslation } from "#src/utils/i18n";

import { SeriesFilterField, SeriesFilterOperator } from "./types";

export const useServiceFilter = (enabled = true): FilterField => {
  const { t } = useTranslation("series");
  const filters = useCalendarStore(selectSeriesFilters);

  const [persistedServiceIdentifiers] = useState(() =>
    extractPersistedFilterIds(filters, SeriesFilterField.SERVICE),
  );

  const { data: persistedServices } = useFetchActivitiesByIds(
    persistedServiceIdentifiers,
    enabled,
    {
      select: selectWorkshopActivityFilterItems,
    },
  );

  return useSearchableFilterField({
    filterType: SeriesFilterField.SERVICE,
    availableFilters: [SeriesFilterOperator.FILTER_IS],
    label: t("seriesFilters.service.label"),
    searchPlaceholder: t("seriesFilters.searchPlaceholder"),
    multiSelect: true,
    persistedItems: persistedServices,
    useSearch: (query) => useSearchWorkshopActivities(query, enabled),
  });
};
