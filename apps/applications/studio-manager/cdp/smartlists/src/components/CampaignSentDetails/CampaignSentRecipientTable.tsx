import { Card, Table, Title } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { CommunicationKind } from "#src/api/constants";
import { useFetchCampaignSentRecipients } from "#src/api/use-fetch-campaign-sent-recipients";
import { useTranslation } from "#src/utils/i18n";

import { useCampaignSentTableColumns } from "./use-campaign-sent-recipient-table-columns";
import {
  MEMBER_PROFILE_URL,
  formatCampaignSentRecipientsTableRow,
} from "./utils";

type CampaignSentRecipientTableProps = {
  campaignUuid: string;
  campaignKind: CommunicationKind;
};

export const CampaignSentRecipientTable = ({
  campaignUuid,
  campaignKind,
}: CampaignSentRecipientTableProps) => {
  const { t } = useTranslation("campaign");
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const {
    data: { results: campaignRecipientList, count },
    isLoading: campaignRecipientListLoading,
  } = useFetchCampaignSentRecipients({
    campaign: campaignUuid,
    page: currentPage,
    page_size: currentPageSize,
  });
  const tableColumns = useCampaignSentTableColumns({
    navigateToMemberProfile: (memberId: number) => {
      window.location.href = MEMBER_PROFILE_URL(memberId);
    },
    copyContactInfo: (contactInfo: string) => {
      navigator.clipboard.writeText(contactInfo);
    },
  });
  const tableRows = formatCampaignSentRecipientsTableRow({
    campaignRecipientList: campaignRecipientList ?? [],
    campaignKind,
    defaultEmptyDate: t("table.campaignRecipient.emptyDate"),
  });

  const doesSmartlistHaveCampaignSent = campaignRecipientList?.length > 0;

  const tableEmptyState = {
    isEmpty: !doesSmartlistHaveCampaignSent,
    emptyConfig: {
      subtitle: t("table.campaignRecipient.emptyState.description"),
    },
  };

  const tableLoadingState = {
    isLoading: campaignRecipientListLoading,
    message: t("table.campaignRecipient.loadingState.description"),
  };

  return (
    <div className="flex flex-col gap-sm">
      <Title htmlVariant="h2" weight="strong">
        {t("table.campaignRecipient.recipientsList.title")}
      </Title>
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
