import { type FC, useState } from "react";
import { useNavigate } from "react-router";

import type { Establishment } from "@bsport/api-book";
import { Button, ListLayout, Tooltip } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { VenueArchiveModal } from "#src/components/venue-archive-modal/venue-archive-modal";
import { VenuesList } from "#src/components/venues-list/venues-list";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const ListPage: FC = () => {
  const { t } = useTranslation("venues-list");
  const navigate = useNavigate();
  const [venueToArchive, setVenueToArchive] = useState<Establishment | null>(
    null,
  );

  const multiLoc =
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
      ...(multiLoc
        ? [
            <Button
              key="create-location"
              kind="default"
              intent="default"
              color="main"
              size="md"
              label={t("actions.createLocation")}
              iconLeft="plus"
              onClick={() => {}}
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
          <VenuesList onArchive={setVenueToArchive} />
        </ListLayout.Content>
      </ListLayout>
      {venueToArchive && (
        <VenueArchiveModal
          venue={venueToArchive}
          onClose={() => setVenueToArchive(null)}
        />
      )}
    </>
  );
};

export default ListPage;
