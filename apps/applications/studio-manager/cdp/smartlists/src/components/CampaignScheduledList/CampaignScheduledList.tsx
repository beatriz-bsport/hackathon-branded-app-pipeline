import { useParams } from "react-router";

import {
  Button,
  Card,
  Collapse,
  Table,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useFetchCampaignScheduled } from "#src/api/use-fetch-campaign-scheduled";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { useCampaignScheduledTableColumns } from "./use-campaign-scheduled-table-columns";
import { formatCampaignScheduledTableRow } from "./utils";

export const CampaignScheduledList = () => {
  const { t } = useTranslation("campaign");
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected id param to be defined");

  const { data: campaignScheduled, isLoading: campaignScheduledLoading } =
    useFetchCampaignScheduled(smartlistId);

  const tableRows = formatCampaignScheduledTableRow(campaignScheduled);

  const tableColumns = useCampaignScheduledTableColumns({
    onEdit: (campaignId) =>
      console.log("Placeholder : Edit scheduled campaign : ", campaignId),
    onDelete: (campaignId) =>
      console.log("Placeholder : Delete scheduled campaign : ", campaignId),
  });

  const doesSmartlistHaveCampaignScheduled = campaignScheduled?.length > 0;

  const tableEmptyState = {
    isEmpty: !doesSmartlistHaveCampaignScheduled,
    emptyConfig: {
      subtitle: t("table.campaignScheduled.emptyState.description"),
    },
  };

  const tableLoadingState = {
    isLoading: campaignScheduledLoading,
    message: t("table.campaignScheduled.loadingState.description"),
  };

  return (
    <div className="flex flex-col gap-md">
      <Collapse
        initiallyOpen={doesSmartlistHaveCampaignScheduled}
        className="flex flex-col gap-md"
      >
        <Collapse.Controller>
          {({ setIsCollapseOpen, isCollapseOpen }) => {
            const toggleOpen = () =>
              setIsCollapseOpen((prevState) => !prevState);

            return (
              <div
                className="flex flex-row gap-sm"
                onClick={() => toggleOpen()}
              >
                <Title htmlVariant="h1" weight="strong">
                  {t("page.campaignScheduled.title")}
                </Title>
                <Button
                  label="Open"
                  intent="flat"
                  color="default"
                  kind="icon-button"
                  icon={isCollapseOpen ? "chevron-down" : "chevron-up"}
                  size="md"
                />
              </div>
            );
          }}
        </Collapse.Controller>
        <Collapse.Content>
          <Card padding="none">
            <Table
              columns={tableColumns}
              rows={tableRows}
              emptyStateProps={tableEmptyState}
              loadingProps={tableLoadingState}
            />
          </Card>
        </Collapse.Content>
      </Collapse>
    </div>
  );
};
