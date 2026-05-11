import { useState } from "react";
import { useParams } from "react-router";
import invariant from "tiny-invariant";

import { type CampaignSent } from "@bsport/api-cdp/communicate";
import {
  Button,
  Card,
  Table,
  Title,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useFetchCampaignSentList } from "#src/api/use-fetch-campaign-sent-list";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { useTranslation } from "#src/utils/i18n";

import { CampaignSentPreviewModal } from "./campaign-sent-preview-modal";
import { useCampaignSentTableColumns } from "./use-campaign-sent-table-columns";
import { formatCampaignSentTableRow } from "./utils";

const LEGACY_POPUP_SETTINGS = "/settings/mobile-personalisation/popups";

export const CampaignSentList = () => {
  const [previewCampaignSent, setPreviewCampaignSent] =
    useState<CampaignSent | null>(null);
  const { t } = useTranslation("campaign");
  const isMobile = !useMatchMedia("md");
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected id param to be defined");
  const { navigateToSmartlistCampaignSentDetails } = useSmartlistNavigation();

  const {
    data: { results: campaignSent, count },
    isLoading: campaignSentLoading,
  } = useFetchCampaignSentList({
    smartlistId,
    page: currentPage,
    pageSize: currentPageSize,
  });

  const tableRows = formatCampaignSentTableRow({
    campaignSentList: campaignSent,
  }).map((row) => ({
    ...row,
    onRowClick: () => {
      navigateToSmartlistCampaignSentDetails(smartlistId, row.campaignUuid);
    },
  }));

  const tableColumns = useCampaignSentTableColumns({
    onPreview: (campaignUuid) => {
      const selectedCampaignSent =
        campaignSent.find((campaign) => campaign.uuid === campaignUuid) ?? null;
      setPreviewCampaignSent(selectedCampaignSent);
    },
  });

  const doesSmartlistHaveCampaignSent = campaignSent?.length > 0;

  const tableEmptyState = {
    isEmpty: !doesSmartlistHaveCampaignSent,
    emptyConfig: {
      subtitle: t("table.campaignSent.emptyState.description"),
    },
  };

  const tableLoadingState = {
    isLoading: campaignSentLoading,
    message: t("table.campaignSent.loadingState.description"),
  };

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-row items-center justify-between gap-sm">
        <Title htmlVariant={isMobile ? "h2" : "h1"} weight="strong">
          {t("page.sentCampaigns.title")}
        </Title>
        <Button
          id="open-pop-ups"
          intent="flat"
          color={isMobile ? "default" : "main"}
          kind="icon-button"
          label={t("actions.openPopUps")}
          size={isMobile ? "md" : "sm"}
          icon="share-03"
          onClick={() => {
            window.location.href = LEGACY_POPUP_SETTINGS;
          }}
        />
      </div>
      <Card padding="none">
        <Table
          columns={tableColumns}
          rows={tableRows}
          emptyStateProps={tableEmptyState}
          loadingProps={tableLoadingState}
          paginationProps={{
            currentPage,
            rowsPerPage: currentPageSize,
            totalItems: count,
            onPageSettingsChange: setPageSettings,
          }}
        />
      </Card>
      {previewCampaignSent ? (
        <CampaignSentPreviewModal
          campaignSent={previewCampaignSent}
          onClose={() => setPreviewCampaignSent(null)}
        />
      ) : null}
    </div>
  );
};
