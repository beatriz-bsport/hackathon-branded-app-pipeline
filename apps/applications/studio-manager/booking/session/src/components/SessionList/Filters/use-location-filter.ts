import uniqBy from "lodash/uniqBy";
import { useMemo, useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { useDebounce } from "@bsport/use-debounce";

import { useSearchEstablishmentGroups } from "#src/hooks/use-search-establishment-groups";
import { useFetchEstablishmentGroups } from "#src/hooks/useFetchEstablishmentGroups";
import { selectFilters, useSessionListStore } from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

type UseFilterConfigResult = {
  shouldDisplayFilter: boolean;
  filterConfig: FilterField;
};

export const useLocationFilter = (): UseFilterConfigResult => {
  const { t } = useTranslation("sessionList");
  const filters = useSessionListStore(selectFilters);

  // Get persisted location IDs from filters
  const [persistedLocationIds] = useState(() => {
    const locationFilter = filters.find(
      (f) => f.field === SessionFilterTypes.LOCATION,
    );
    return (
      locationFilter?.valueIds
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id)) || []
    );
  });

  // Fetch persisted locations by IDs
  const { data: persistedLocations } = useFetchEstablishmentGroups(
    persistedLocationIds,
    true,
    {
      select: (groups) =>
        groups.map((group) => ({
          id: `${group.id}`,
          label: group.name,
        })) || [],
    },
  );

  // Load and filter establishment groups for the establishment group filter
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(inputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: establishmentGroups } =
    useSearchEstablishmentGroups(debouncedSearch);

  // Merge persisted locations with search results, avoiding duplicates
  const allLocations = useMemo(() => {
    const searchLocations = establishmentGroups || [];
    const persisted = persistedLocations || [];

    return uniqBy([...searchLocations, ...persisted], (val) => val.id);
  }, [establishmentGroups, persistedLocations]);

  const hasMultiLocation =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization &&
    !!establishmentGroups &&
    establishmentGroups.length !== 0;

  const hasPersistedLocationsFilter = persistedLocationIds.length > 0;

  return {
    shouldDisplayFilter: hasMultiLocation || hasPersistedLocationsFilter,
    filterConfig: {
      id: SessionFilterTypes.LOCATION,
      label: t("table.filters.location.label"),
      availableFilters: [SessionFilters.FILTER_IS],
      values: allLocations,
      multiSelect: true,
      searchConfig: {
        value: inputValue,
        onChange: (value: string) => {
          setInputValue(value);
          debouncedSetDebouncedSearch(value);
        },
        placeholder: t("table.filters.searchPlaceholder"),
      },
    },
  };
};
