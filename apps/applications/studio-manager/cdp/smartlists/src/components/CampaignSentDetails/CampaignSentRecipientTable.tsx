import { useParams } from "react-router";

import { Card, Table, Title } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { CommunicationKind } from "#src/api/constants";
import { useFetchCampaignSentRecipientsWithMemberData } from "#src/api/use-fetch-campaign-sent-recipients-with-member-data";
import { SMARTLIST_LEGACY_URLS } from "#src/urls";
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
  const { id: smartlistId } = useParams<{ id: string }>();
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const {
    data: { results: campaignRecipientList, count },
    isLoading: campaignRecipientListLoading,
  } = useFetchCampaignSentRecipientsWithMemberData({
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
      title: t("table.campaignSentRecipient.emptyState.title"),
      subtitle: t("table.campaignSentRecipient.emptyState.description"),
      secondaryButtonConfig: {
        label: t("table.campaignSentRecipient.emptyState.reviewFilters"),
        onClick: () => {
          // TODO: Implement navigation to smartlist custom segments filters page if needed
          window.location.assign(
            SMARTLIST_LEGACY_URLS.smartlistMember(Number(smartlistId)),
          );
        },
      },
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
