import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSearchEstablishmentGroups } from "#src/hooks/use-search-establishment-groups";
import { useFetchEstablishmentGroups } from "#src/hooks/useFetchEstablishmentGroups";
import { useSearchableFilterField } from "#src/hooks/useSearchableFilterField";
import { selectSessionFilters, useCalendarStore } from "#src/stores/calendar";
import { extractPersistedFilterIds } from "#src/utils/extract-persisted-filter-ids";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

type UseFilterConfigResult = {
  shouldDisplayFilter: boolean;
  filterConfig: FilterField;
};

export const useLocationFilter = (): UseFilterConfigResult => {
  const { t } = useTranslation("sessionList");
  const filters = useCalendarStore(selectSessionFilters);

  const [persistedIds] = useState(() =>
    extractPersistedFilterIds(filters, SessionFilterTypes.LOCATION),
  );

  const { data: persistedLocations } = useFetchEstablishmentGroups(
    persistedIds,
    true,
    {
      select: (groups) =>
        groups.map((group) => ({
          id: `${group.id}`,
          label: group.name,
        })) || [],
    },
  );

  const filterConfig = useSearchableFilterField({
    filterType: SessionFilterTypes.LOCATION,
    availableFilters: [SessionFilters.FILTER_IS],
    label: t("table.filters.location.label"),
    searchPlaceholder: t("table.filters.searchPlaceholder"),
    multiSelect: true,
    persistedItems: persistedLocations,
    useSearch: (query) => useSearchEstablishmentGroups(query),
  });

  const hasMultiLocation =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization &&
    filterConfig.values.length > 0;

  return {
    shouldDisplayFilter: hasMultiLocation || persistedIds.length > 0,
    filterConfig,
  };
};
