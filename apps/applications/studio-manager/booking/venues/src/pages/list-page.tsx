import type { FC } from "react";

import { Button, ListLayout, Tooltip } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { VenuesList } from "#src/components/venues-list/venues-list";
import { useTranslation } from "#src/utils/i18n";

const ListPage: FC = () => {
  const { t } = useTranslation("venues-list");

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
          onClick={() => {}}
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
        <VenuesList />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
