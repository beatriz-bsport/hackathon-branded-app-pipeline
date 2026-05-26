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
import { VenueArchiveModal } from "#src/components/venue-archive-modal/venue-archive-modal";
import { VenuesList } from "#src/components/venues-list/venues-list";
import { useVenuesModals } from "#src/hooks/use-venues-modals";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

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
    modalState,
    openArchiveModal,
    openLocationCreateModal,
    openLocationEditModal,
    openLocationDeleteModal,
    closeModal,
  } = useVenuesModals();

  const handleTabChange = useCallback(
    (tabId: string) => {
      setSearchParams(
        (prev) => {
          prev.set("tab", tabId);
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

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
      <Tooltip key="archive" label={t("actions.archive")} placement="bottom">
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
            <Button
              key="create-location"
              kind="default"
              intent="default"
              color="main"
              size="md"
              label={t("actions.createLocation")}
              iconLeft="plus"
              onClick={() => openLocationCreateModal()}
            />,
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
          endGroupActions={endGroupActions}
          callToActionButton={
            <ListLayout.Button
              iconLeft="plus"
              intent="call-to-action"
              color="main"
              label={t("actions.createVenue")}
              onClick={() => {}}
            />
          }
        />
        <ListLayout.Content>
          {activeTab === "venues" && (
            <VenuesList onArchive={openArchiveModal} />
          )}
          {activeTab === "locations" && (
            <LocationsList
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
    </>
  );
};

export default ListPage;
