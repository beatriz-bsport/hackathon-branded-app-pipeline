import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

import {
  fetchEstablishmentGroupsQueryOptions,
  searchEstablishmentsQueryOptions,
} from "@bsport/api-book";
import {
  type FilterElementState,
  type FilterProps,
} from "@bsport/kaizen-primitive-core";

import { VENUES_PAGE_SIZE } from "#src/hooks/constants";
import { fetch } from "#src/utils/fetch";
import {
  type VenuesActiveFilters,
  getUniqueCities,
} from "#src/utils/filter-venues";
import { useTranslation } from "#src/utils/i18n";

const FILTER_IS = "is";
const NO_LOCATION_ID = "no-location";

const EMPTY_FILTERS: VenuesActiveFilters = {
  cities: [],
  groupIds: [],
  includeNoLocation: false,
};

type VenuesFiltersConfig = {
  filterConfig: FilterProps;
  filterRef: React.RefObject<{ resetFilters: () => void } | null>;
  activeFilters: VenuesActiveFilters;
  handleClearFilters: () => void;
};

export const useVenuesFilter = (): VenuesFiltersConfig => {
  const { t } = useTranslation("venues-list");

  const [activeFilters, setActiveFilters] =
    useState<VenuesActiveFilters>(EMPTY_FILTERS);

  const filterRef = useRef<{ resetFilters: () => void }>(null);

  // Non-suspense reads: share React Query's cache with the suspense queries used
  // for display, so the header never suspends and dropdown values fill in on load.
  const { data: venuesData } = useQuery(
    searchEstablishmentsQueryOptions(fetch, {
      q: "",
      page_size: VENUES_PAGE_SIZE,
      disabled: false,
    }),
  );
  const { data: groupsData } = useQuery(
    fetchEstablishmentGroupsQueryOptions(fetch, {}),
  );

  const cities = getUniqueCities(venuesData?.results ?? []);
  const groups = groupsData?.results ?? [];

  const filters = [{ id: FILTER_IS, label: t("filters.operators.is") }];

  const fields: FilterProps["fields"] = {
    location: {
      id: "location",
      label: t("filters.location"),
      availableFilters: [FILTER_IS],
      multiSelect: true,
      values: [
        ...groups.map((group) => ({
          id: String(group.id),
          label: group.name,
        })),
        { id: NO_LOCATION_ID, label: t("filters.noLocation") },
      ],
    },
    city: {
      id: "city",
      label: t("filters.city"),
      availableFilters: [FILTER_IS],
      multiSelect: true,
      values: cities.map((city) => ({ id: city, label: city })),
    },
  };

  const onFilterChange = (filterElements: FilterElementState[]) => {
    const next: VenuesActiveFilters = {
      cities: [],
      groupIds: [],
      includeNoLocation: false,
    };

    for (const element of filterElements) {
      if (element.field === "city") {
        next.cities.push(...element.valueIds);
      } else if (element.field === "location") {
        for (const valueId of element.valueIds) {
          if (valueId === NO_LOCATION_ID) {
            next.includeNoLocation = true;
          } else {
            next.groupIds.push(Number(valueId));
          }
        }
      }
    }

    setActiveFilters(next);
  };

  const handleClearFilters = () => {
    setActiveFilters(EMPTY_FILTERS);
    filterRef.current?.resetFilters();
  };

  const filterConfig: FilterProps = {
    fields,
    filters,
    onFilterChange,
    selectFieldLabel: t("filters.selectField"),
  };

  return { filterConfig, filterRef, activeFilters, handleClearFilters };
};
