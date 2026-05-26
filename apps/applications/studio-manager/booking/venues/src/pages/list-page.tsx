import { type FC } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout, Tooltip } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { LocationFormModal } from "#src/components/location-form-modal/location-form-modal";
import { VenueArchiveModal } from "#src/components/venue-archive-modal/venue-archive-modal";
import { VenuesList } from "#src/components/venues-list/venues-list";
import { useVenuesModals } from "#src/hooks/use-venues-modals";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const ListPage: FC = () => {
  const { t } = useTranslation("venues-list");
  const navigate = useNavigate();
  const {
    modalState,
    openArchiveModal,
    openLocationCreateModal,
    openLocationEditModal,
    closeModal,
  } = useVenuesModals();

  const multiLocalization =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization;

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
          <VenuesList
            onArchive={openArchiveModal}
            onEditLocation={openLocationEditModal}
          />
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
    </>
  );
};

export default ListPage;
