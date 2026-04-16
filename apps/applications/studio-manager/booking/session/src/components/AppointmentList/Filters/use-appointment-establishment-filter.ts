import { useState } from "react";

import type { FilterField } from "@bsport/kaizen-primitive-core";

import { useSearchEstablishments } from "#src/hooks/use-search-establishments";
import { useFetchEstablishments } from "#src/hooks/useFetchEstablishments";
import { useSearchableFilterField } from "#src/hooks/useSearchableFilterField";
import {
  selectAppointmentFilters,
  useCalendarStore,
} from "#src/stores/calendar";
import { extractPersistedFilterIds } from "#src/utils/extract-persisted-filter-ids";
import { useTranslation } from "#src/utils/i18n";

import { AppointmentFilterTypes, AppointmentFilters } from "./types";

export const useAppointmentEstablishmentFilter = (): FilterField => {
  const { t } = useTranslation("sessionList");
  const filters = useCalendarStore(selectAppointmentFilters);

  const [persistedIds] = useState(() =>
    extractPersistedFilterIds(filters, AppointmentFilterTypes.ESTABLISHMENT),
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
    filterType: AppointmentFilterTypes.ESTABLISHMENT,
    availableFilters: [AppointmentFilters.FILTER_IS],
    label: t("appointmentTable.filters.establishment.label"),
    searchPlaceholder: t("appointmentTable.filters.searchPlaceholder"),
    multiSelect: false,
    persistedItems: persistedEstablishments,
    useSearch: (query) => useSearchEstablishments(query),
  });
};
