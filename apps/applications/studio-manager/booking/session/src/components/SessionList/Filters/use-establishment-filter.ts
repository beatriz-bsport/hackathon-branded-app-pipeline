import uniqBy from "lodash/uniqBy";
import { useMemo, useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useSearchEstablishments } from "#src/hooks/use-search-establishments";
import { useFetchEstablishments } from "#src/hooks/useFetchEstablishments";
import { selectFilters, useSessionListStore } from "#src/stores/session-list";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useEstablishmentFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const filters = useSessionListStore(selectFilters);

  // Get persisted establishment IDs from filters
  const [persistedEstablishmentIds] = useState(() => {
    const establishmentFilter = filters.find(
      (f) => f.field === SessionFilterTypes.ESTABLISHMENT,
    );
    return (
      establishmentFilter?.valueIds
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id)) || []
    );
  });

  // Fetch persisted establishments by IDs
  const { data: persistedEstablishments } = useFetchEstablishments(
    persistedEstablishmentIds,
    true,
    {
      select: (establishments) =>
        establishments.map((establishment) => ({
          id: `${establishment.id}`,
          label: establishment?.title,
        })) || [],
    },
  );

  // Load establishments for the establishment filter
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(inputValue);
  const debouncedSetDebouncedSearch = useDebounce(setDebouncedSearch);

  const { data: establishments } = useSearchEstablishments(debouncedSearch);

  // Merge persisted establishments with search results, avoiding duplicates
  const allEstablishments = useMemo(() => {
    const searchEstablishments = establishments || [];
    const persisted = persistedEstablishments || [];

    return uniqBy([...searchEstablishments, ...persisted], (val) => val.id);
  }, [establishments, persistedEstablishments]);

  return {
    id: SessionFilterTypes.ESTABLISHMENT,
    label: t("table.filters.establishment.label"),
    availableFilters: [SessionFilters.FILTER_IS],
    values: allEstablishments,
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
