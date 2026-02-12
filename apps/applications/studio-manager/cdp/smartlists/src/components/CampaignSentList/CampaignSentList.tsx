import { useParams } from "react-router";
import invariant from "tiny-invariant";

import { Button, Card, Table, Title } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { useFetchCampaignSent } from "#src/api/use-fetch-campaign-sent";
import { useTranslation } from "#src/utils/i18n";

import { useCampaignSentTableColumns } from "./use-campaign-sent-table-columns";
import { formatCampaignSentTableRow } from "./utils";

const LEGACY_POPUP_SETTINGS = "/settings/mobile-personalisation/popups";

export const CampaignSentList = () => {
  const { t } = useTranslation("campaign");
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected id param to be defined");

  const {
    data: { results: campaignSent, count },
    isLoading: campaignSentLoading,
  } = useFetchCampaignSent({
    smartlistId,
    page: currentPage,
    pageSize: currentPageSize,
  });

  const tableRows = formatCampaignSentTableRow(campaignSent);

  const tableColumns = useCampaignSentTableColumns({
    onPreview: (campaignId) =>
      console.log("Placeholder : preview sent campaign : ", campaignId),
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
      <div className="flex flex-row justify-between">
        <Title htmlVariant="h1" weight="strong">
          {t("page.sentCampaigns.title")}
        </Title>
        <Button
          id="open-pop-ups"
          intent="default"
          color="main"
          label={t("actions.openPopUps")}
          size="sm"
          iconRight="share-03"
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
    </div>
  );
};
