import { type FC, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

import {
  Button,
  HeaderLayoutProps,
  ListLayout,
  Tooltip,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { LocationDeleteModal } from "#src/components/location-delete-modal/location-delete-modal";
import { LocationFormModal } from "#src/components/location-form-modal/location-form-modal";
import { LocationsList } from "#src/components/locations-list/locations-list";
import { CardLoader } from "#src/components/query-boundary/fallbacks.js";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary.js";
import { VenueArchiveModal } from "#src/components/venue-archive-modal/venue-archive-modal";
import { VenueFormModal } from "#src/components/venue-form-modal/venue-form-modal";
import { VenuesList } from "#src/components/venues-list/venues-list";
import { VenuesMap } from "#src/components/venues-map/venues-map.js";
import { useVenuesSearchQuery } from "#src/hooks/api/use-venues-search-query.js";
import { usePageHeader } from "#src/hooks/use-page-header";
import { useVenueGroupMap } from "#src/hooks/use-venue-group-map";
import { useVenuesFilter } from "#src/hooks/use-venues-filter";
import { useVenuesModals } from "#src/hooks/use-venues-modals";
import { ABSOLUTE_ROUTES } from "#src/urls";
import {
  type VenuesActiveFilters,
  filterVenues,
} from "#src/utils/filter-venues";
import { useTranslation } from "#src/utils/i18n";

type VenuesMapSectionProps = {
  activeFilters: VenuesActiveFilters;
  searchQuery: string;
};

const VenuesMapSection: FC<VenuesMapSectionProps> = ({
  activeFilters,
  searchQuery,
}) => {
  const { data } = useVenuesSearchQuery({ q: searchQuery });
  const { groupMap } = useVenueGroupMap();
  const filteredVenues = filterVenues(data.results, activeFilters, groupMap);
  return <VenuesMap venues={filteredVenues} />;
};

const VALID_TABS = ["venues", "locations"] as const;
type VenuesTab = (typeof VALID_TABS)[number];

const getActiveTab = (raw: string | null): VenuesTab =>
  (VALID_TABS as readonly string[]).includes(raw ?? "")
    ? (raw as VenuesTab)
    : "venues";

const ListPage: FC = () => {
  const { t } = useTranslation("venues-list");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const multiLocalization =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization;

  const rawTab = getActiveTab(searchParams.get("tab"));
  const activeTab =
    !multiLocalization && rawTab === "locations" ? "venues" : rawTab;

  const {
    venuesSearchConfig,
    locationsSearchConfig,
    venuesSearchInput,
    locationsSearchInput,
    resetLocationsSearch,
  } = usePageHeader();

  const {
    modalState,
    openVenueCreateModal,
    openVenueEditModal,
    openArchiveModal,
    openLocationCreateModal,
    openLocationEditModal,
    openLocationDeleteModal,
    closeModal,
  } = useVenuesModals();

  const handleTabChange = useCallback(
    (tabId: string) => {
      resetLocationsSearch();
      setSearchParams(
        (prev) => {
          prev.set("tab", tabId);
          return prev;
        },
        { replace: true },
      );
    },
    [resetLocationsSearch, setSearchParams],
  );

  const { filterConfig, filterRef, activeFilters } = useVenuesFilter();
  const searchQuery = venuesSearchInput.trim();
  const pageTabs: HeaderLayoutProps["pageTabs"] = multiLocalization
    ? {
        value: activeTab,
        onValueChange: handleTabChange,
        orientation: "horizontal",
        tabs: [
          { id: "venues", label: t("tabs.venues") },
          { id: "locations", label: t("tabs.locations") },
        ],
      }
    : undefined;

  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <Tooltip key="archive" label={t("actions.archive")} placement="top">
        <Button
          kind="icon-button"
          icon="archive"
          intent="default"
          color="main"
          size="md"
          label={t("actions.archive")}
          onClick={() => navigate(ABSOLUTE_ROUTES.ARCHIVED)}
        />
      </Tooltip>,
      ...(multiLocalization
        ? [
            <Tooltip
              key="create-location"
              label={t("actions.createLocationTooltip")}
              placement="top"
            >
              <Button
                kind="default"
                intent="default"
                color="main"
                size="md"
                label={t("actions.createLocation")}
                iconLeft="plus"
                onClick={() => openLocationCreateModal()}
              />
            </Tooltip>,
          ]
        : []),
    ],
  });

  return (
    <>
      <ListLayout>
        <ListLayout.Header
          pageTitle={t("pageTitle")}
          pageTabs={pageTabs}
          searchConfig={
            activeTab === "venues" ? venuesSearchConfig : locationsSearchConfig
          }
          filterConfig={activeTab === "venues" ? filterConfig : undefined}
          filterRef={filterRef}
          endGroupActions={endGroupActions}
          callToActionButton={
            <Tooltip
              label={t("actions.createVenueTooltip")}
              placement="top-right"
            >
              <ListLayout.Button
                iconLeft="plus"
                intent="call-to-action"
                color="main"
                label={t("actions.createVenue")}
                onClick={openVenueCreateModal}
              />
            </Tooltip>
          }
        />
        <ListLayout.Content>
          {activeTab === "venues" && (
            <>
              <VenuesList
                onCreate={openVenueCreateModal}
                onEdit={openVenueEditModal}
                activeFilters={activeFilters}
                searchQuery={searchQuery}
                onArchive={openArchiveModal}
              />
              <QueryBoundary loadingFallback={<CardLoader />}>
                <VenuesMapSection
                  activeFilters={activeFilters}
                  searchQuery={searchQuery}
                />
              </QueryBoundary>
            </>
          )}
          {activeTab === "locations" && (
            <LocationsList
              searchQuery={locationsSearchInput}
              onCreate={openLocationCreateModal}
              onEdit={openLocationEditModal}
              onDelete={openLocationDeleteModal}
            />
          )}
        </ListLayout.Content>
      </ListLayout>

      {modalState?.type === "archive" && (
        <VenueArchiveModal venue={modalState.venue} onClose={closeModal} />
      )}

      {modalState?.type === "location-create" && (
        <LocationFormModal
          preselectedVenueId={modalState.preselectedVenue?.id}
          onClose={closeModal}
        />
      )}

      {modalState?.type === "location-edit" && (
        <LocationFormModal
          location={modalState.location}
          onClose={closeModal}
        />
      )}

      {modalState?.type === "location-delete" && (
        <LocationDeleteModal
          location={modalState.location}
          onClose={closeModal}
        />
      )}

      {modalState?.type === "venue-create" && (
        <VenueFormModal
          multiLocalization={multiLocalization}
          onClose={closeModal}
        />
      )}

      {modalState?.type === "venue-edit" && (
        <VenueFormModal
          multiLocalization={multiLocalization}
          venue={modalState.venue}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default ListPage;
