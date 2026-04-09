import { useMemo, useState } from "react";
import { useParams } from "react-router";

import {
  Button,
  Card,
  Collapse,
  Table,
  Title,
  toast,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import type { CampaignScheduled } from "#src/api/types";
import { useFetchCampaignScheduledList } from "#src/api/use-fetch-campaign-scheduled-list";
import { DeleteScheduledCommunicationModal } from "#src/components/DeleteScheduledCommunicationModal/DeleteScheduledCommunicationModal";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { CAMPAIGN_CHANNEL_EMAIL, CAMPAIGN_CHANNEL_PUSH } from "#src/urls";
import {
  CAMPAIGN_SCHEDULED_DELETE_INLINE_ACTION,
  type CampaignScheduledInlineActions,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { useCampaignScheduledTableColumns } from "./use-campaign-scheduled-table-columns";
import { formatCampaignScheduledTableRow } from "./utils";

export const CampaignScheduledList = () => {
  const { t } = useTranslation("campaign");
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected id param to be defined");

  const [currentInlineAction, setCurrentInlineAction] =
    useState<CampaignScheduledInlineActions | null>(null);
  const [scheduledCampaignForAction, setScheduledCampaignForAction] =
    useState<CampaignScheduled | null>(null);
  const { navigateToSmartlistCampaignEdit } = useSmartlistNavigation();

  const { data: campaignScheduled, isLoading: campaignScheduledLoading } =
    useFetchCampaignScheduledList(smartlistId);

  const tableRows = formatCampaignScheduledTableRow({
    campaignScheduledList: campaignScheduled,
    smartlistId,
  });

  const campaignScheduledById = useMemo(() => {
    return (
      campaignScheduled?.reduce(
        (acc, campaign) => {
          acc[campaign.id] = campaign;
          return acc;
        },
        {} as Record<number, CampaignScheduled>,
      ) ?? null
    );
  }, [campaignScheduled]);

  const tableColumns = useCampaignScheduledTableColumns({
    onEdit: (campaignId) => {
      const campaign = campaignScheduledById?.[campaignId];
      if (!campaign) {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("table.campaignScheduled.toasts.error.campaignNotFound"),
          buttonIcon: "x-close",
        });
        return;
      }
      const channel =
        campaign?.communication_kind === CommunicationKind.PUSH
          ? CAMPAIGN_CHANNEL_PUSH
          : CAMPAIGN_CHANNEL_EMAIL;

      navigateToSmartlistCampaignEdit(smartlistId, channel, String(campaignId));
    },
    onDelete: (campaignId) => {
      const campaign = campaignScheduledById?.[campaignId] ?? null;
      if (!campaign) {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("table.campaignScheduled.toasts.error.campaignNotFound"),
          buttonIcon: "x-close",
        });
        return;
      }
      setScheduledCampaignForAction(campaign);
      setCurrentInlineAction(CAMPAIGN_SCHEDULED_DELETE_INLINE_ACTION);
    },
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
      {currentInlineAction === CAMPAIGN_SCHEDULED_DELETE_INLINE_ACTION &&
        scheduledCampaignForAction && (
          <DeleteScheduledCommunicationModal
            isOpen
            onClose={() => {
              setCurrentInlineAction(null);
              setScheduledCampaignForAction(null);
            }}
            campaign={scheduledCampaignForAction}
            smartlistId={smartlistId}
          />
        )}
    </div>
  );
};
