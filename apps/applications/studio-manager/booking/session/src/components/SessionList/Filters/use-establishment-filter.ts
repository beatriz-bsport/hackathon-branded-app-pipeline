import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";

import { useSearchEstablishments } from "#src/hooks/use-search-establishments";
import { useFetchEstablishments } from "#src/hooks/useFetchEstablishments";
import { useSearchableFilterField } from "#src/hooks/useSearchableFilterField";
import { selectSessionFilters, useCalendarStore } from "#src/stores/calendar";
import { extractPersistedFilterIds } from "#src/utils/extract-persisted-filter-ids";
import { useTranslation } from "#src/utils/i18n";

import { SessionFilterTypes, SessionFilters } from "./types";

export const useEstablishmentFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const filters = useCalendarStore(selectSessionFilters);

  const [persistedIds] = useState(() =>
    extractPersistedFilterIds(filters, SessionFilterTypes.ESTABLISHMENT),
  );

  const { data: persistedEstablishments } = useFetchEstablishments(
    persistedIds,
    true,
    {
      select: (establishments) =>
        establishments.map((establishment) => ({
          id: `${establishment.id}`,
          label: establishment?.title,
        })) || [],
    },
  );

  return useSearchableFilterField({
    filterType: SessionFilterTypes.ESTABLISHMENT,
    availableFilters: [SessionFilters.FILTER_IS, SessionFilters.FILTER_NOT],
    label: t("table.filters.establishment.label"),
    searchPlaceholder: t("table.filters.searchPlaceholder"),
    multiSelect: true,
    persistedItems: persistedEstablishments,
    useSearch: (query) => useSearchEstablishments(query),
  });
};
