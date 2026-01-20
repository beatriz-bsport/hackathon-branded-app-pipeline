import uniqBy from "lodash/uniqBy";
import { useMemo, useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useFetchActivitiesByIds } from "#src/hooks/use-fetch-activities-by-ids";
import { useSearchActivities } from "#src/hooks/use-search-activities";
import { selectFilters, useSessionListStore } from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useActivityNameFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const filters = useSessionListStore(selectFilters);

  // Get persisted activity IDs from filters
  const [persistedActivityIds] = useState(() => {
    const activityFilter = filters.find(
      (f) => f.field === SessionFilterTypes.ACTIVITY_NAME,
    );
    return (
      activityFilter?.valueIds
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id)) || []
    );
  });

  // Fetch persisted activities by IDs
  const { data: persistedActivities } =
    useFetchActivitiesByIds(persistedActivityIds);

  // Load activitynames for the activityname filter
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(inputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: activitynames } = useSearchActivities(debouncedSearch);

  // Merge persisted activities with search results, avoiding duplicates
  const allActivities = useMemo(() => {
    const searchActivities = activitynames || [];
    const persisted = persistedActivities || [];

    return uniqBy([...searchActivities, ...persisted], (val) => val.id);
  }, [activitynames, persistedActivities]);

  return {
    id: SessionFilterTypes.ACTIVITY_NAME,
    label: t("table.filters.activityName.label"),
    availableFilters: [SessionFilters.FILTER_IS],
    values: allActivities,
    multiSelect: true,
    searchConfig: {
      value: inputValue,
      onChange: (value: string) => {
        setInputValue(value);
        debouncedSetDebouncedSearch(value);
      },
      placeholder: t("table.filters.searchPlaceholder"),
    },
  };
};
