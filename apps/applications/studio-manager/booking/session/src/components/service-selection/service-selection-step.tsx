import { type ChangeEvent, useCallback, useId, useMemo, useState } from "react";

import type { MetaActivity } from "@bsport/api-book";
import {
  Body,
  Button,
  TextField,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { ServiceSelectionList } from "#src/components/service-selection/service-selection-list";
import { ServiceSelectionTable } from "#src/components/service-selection/service-selection-table";
import type {
  AddServiceButtonConfig,
  ServiceSelectionContext,
  ServiceSelectionLabels,
  ServiceSelectionRow,
} from "#src/components/service-selection/service-selection-types";
import { usePaginatedGroupActivities } from "#src/hooks/usePaginatedGroupActivities";

const FIRST_PAGE = 1;

const getDefaultServiceDisplayName = (service: MetaActivity) => service.name;

type ServiceSelectionStepProps = {
  labels: ServiceSelectionLabels;
  selectedServiceId?: number;
  onSelectService: (
    service: MetaActivity,
    context: ServiceSelectionContext,
  ) => void;
  addServiceButton?: AddServiceButtonConfig;
  getServiceDisplayName?: (service: MetaActivity) => string;
  getServiceTypeLabel?: (service: MetaActivity) => string;
  isWorkshop?: boolean;
  paginationNamespace?: string;
};

export const ServiceSelectionStep = ({
  labels,
  selectedServiceId,
  onSelectService,
  addServiceButton,
  getServiceDisplayName = getDefaultServiceDisplayName,
  getServiceTypeLabel,
  isWorkshop,
  paginationNamespace,
}: ServiceSelectionStepProps) => {
  const isMobile = !useMatchMedia("lg");
  const componentId = useId();
  const searchInputId = `${componentId}-service-selection-search`;
  const listId = `${componentId}-service-selection-list`;
  const tableId = `${componentId}-service-selection-table`;

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const setSearchQueryDebounced = useDebounce(setSearchQuery);

  const { groupActivities, isLoading, paginationProps, setPage } =
    usePaginatedGroupActivities({
      customerEnabled: true,
      isWorkshop,
      paginationNamespace,
      searchParams: { searchQuery },
    });

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(event.target.value);
      setPage(FIRST_PAGE);
      setSearchQueryDebounced(event.target.value);
    },
    [setPage, setSearchQueryDebounced],
  );

  const handleClearSearch = useCallback(() => {
    setSearchInputValue("");
    setSearchQuery("");
    setPage(FIRST_PAGE);
    setSearchQueryDebounced("");
  }, [setPage, setSearchQueryDebounced]);

  const rows = useMemo<ServiceSelectionRow[]>(
    () =>
      groupActivities.map((service) => ({
        ...service,
        serviceName: getServiceDisplayName(service),
        serviceType: getServiceTypeLabel?.(service),
        isActive: selectedServiceId === service.id,
        onRowClick: () => {
          onSelectService(service, { searchQuery });
        },
      })),
    [
      getServiceDisplayName,
      getServiceTypeLabel,
      groupActivities,
      onSelectService,
      searchQuery,
      selectedServiceId,
    ],
  );

  const hasSearchQuery = searchInputValue.trim().length > 0;
  const hasNoServices = paginationProps.totalItems === 0;
  const hasEmptySearchState = !!labels.emptySearchTitle;
  const shouldShowEmptyState = hasEmptySearchState
    ? !hasSearchQuery && hasNoServices
    : hasNoServices;
  const shouldShowEmptySearchState =
    hasEmptySearchState && hasSearchQuery && hasNoServices;

  const emptyStateProps = {
    isEmpty: shouldShowEmptyState,
    isEmptySearch: shouldShowEmptySearchState,
    emptyConfig: {
      title: labels.emptyTitle,
    },
    emptySearchConfig: labels.emptySearchTitle
      ? {
          title: labels.emptySearchTitle,
        }
      : undefined,
  };

  const results = isMobile ? (
    <ServiceSelectionList
      id={listId}
      rows={rows}
      labels={labels}
      isLoading={isLoading}
      emptyStateProps={emptyStateProps}
      paginationProps={paginationProps}
    />
  ) : (
    <ServiceSelectionTable
      id={tableId}
      rows={rows}
      labels={labels}
      isLoading={isLoading}
      emptyStateProps={emptyStateProps}
      paginationProps={paginationProps}
    />
  );

  return (
    <div className="flex w-full flex-col gap-lg">
      <div className="flex flex-wrap items-center justify-between gap-sm">
        <Body htmlVariant="p" size="lg">
          {labels.description}
        </Body>
        {addServiceButton ? (
          <Button
            label={addServiceButton.label}
            iconRight="link-external-02"
            intent="flat"
            color="main"
            size="md"
            className="self-start"
            onClick={addServiceButton.onClick}
          />
        ) : null}
      </div>

      <TextField
        id={searchInputId}
        iconLeft="search-refraction"
        fullWidth
        placeholder={labels.searchPlaceholder}
        type="search"
        value={searchInputValue}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />

      <div className="max-h-[540px] overflow-y-auto rounded-sm border-stroke-thin border-stroke-divider">
        {results}
      </div>
    </div>
  );
};
