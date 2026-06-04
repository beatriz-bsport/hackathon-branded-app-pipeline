import { useState } from "react";

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
import { useTranslation } from "#src/utils/i18n";

import { CampaignSentPreviewModal } from "./campaign-sent-preview-modal";
import { useCampaignSentTableColumns } from "./use-campaign-sent-table-columns";
import { formatCampaignSentTableRow } from "./utils";

type CampaignSentTableRow = ReturnType<
  typeof formatCampaignSentTableRow
>[number];

type CampaignSentListTargetProps =
  | {
      smartlistId: string;
      segmentIdentifier?: never;
    }
  | {
      segmentIdentifier: string;
      smartlistId?: never;
    };

type CampaignSentListProps = CampaignSentListTargetProps & {
  onRowClick?: (params: {
    campaign: CampaignSent;
    row: CampaignSentTableRow;
  }) => void;
  onOpenPopUpsClick?: () => void;
  emptyStateDescription?: string;
};

const getCampaignSentListTargetParams = (
  props: CampaignSentListTargetProps,
) => {
  if (typeof props.smartlistId === "string") {
    return { smartlistId: props.smartlistId };
  }

  if (typeof props.segmentIdentifier === "string") {
    return { segmentIdentifier: props.segmentIdentifier };
  }

  throw new Error("Expected campaign sent target to be defined");
};

export const CampaignSentList = (props: CampaignSentListProps) => {
  const [previewCampaignSent, setPreviewCampaignSent] =
    useState<CampaignSent | null>(null);
  const { t } = useTranslation("campaign");
  const isMobile = !useMatchMedia("md");
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const { emptyStateDescription, onOpenPopUpsClick, onRowClick } = props;
  const targetParams = getCampaignSentListTargetParams(props);

  const {
    data: { results: campaignSent, count },
    isLoading: campaignSentLoading,
  } = useFetchCampaignSentList({
    ...targetParams,
    page: currentPage,
    pageSize: currentPageSize,
  });

  const tableRows = formatCampaignSentTableRow({
    campaignSentList: campaignSent,
  }).map((row, index) => {
    const campaign = campaignSent[index];

    if (!onRowClick || !campaign) {
      return row;
    }

    return {
      ...row,
      onRowClick: () => onRowClick({ campaign, row }),
    };
  });

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
      subtitle:
        emptyStateDescription ?? t("table.campaignSent.emptyState.description"),
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
        {onOpenPopUpsClick ? (
          <Button
            id="open-pop-ups"
            intent="flat"
            color={isMobile ? "default" : "main"}
            kind="icon-button"
            label={t("actions.openPopUps")}
            size={isMobile ? "md" : "sm"}
            icon="share-03"
            onClick={onOpenPopUpsClick}
          />
        ) : null}
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
