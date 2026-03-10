import { Table } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { CommunicationKind } from "#src/api/constants";
import { useFetchCommunicationRecipientsPreview } from "#src/api/use-fetch-communication-recipients-preview";
import { COMMUNICATION_CHANNEL_BY_KIND_MAP } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { useCampaignScheduledRecipientTableColumns } from "./use-campaign-scheduled-recipient-table-columns";
import {
  MEMBER_PROFILE_URL,
  formatCampaignScheduledRecipientsTableRow,
} from "./utils";

type CampaignScheduledRecipientTableProps = {
  campaignScheduledId: number;
  campaignKind: CommunicationKind;
};

export const CampaignScheduledRecipientTable = ({
  campaignScheduledId,
  campaignKind,
}: CampaignScheduledRecipientTableProps) => {
  const { t } = useTranslation("campaign");
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();
  const {
    data: { results: campaignRecipientList, count },
  } = useFetchCommunicationRecipientsPreview({
    channel: COMMUNICATION_CHANNEL_BY_KIND_MAP[campaignKind],
    is_marketing: true,
    target: {
      type: "communication_scheduled",
      communication_scheduled_id: campaignScheduledId,
    },
    page: currentPage,
    page_size: currentPageSize,
  });
  const tableColumns = useCampaignScheduledRecipientTableColumns({
    navigateToMemberProfile: (memberId: number) => {
      window.location.href = MEMBER_PROFILE_URL(memberId);
    },
    copyContactInfo: (contactInfo: string) => {
      navigator.clipboard.writeText(contactInfo);
    },
  });
  const tableRows = formatCampaignScheduledRecipientsTableRow({
    campaignRecipientList: campaignRecipientList ?? [],
    campaignKind,
  });

  const doesSmartlistHaveCampaignSent = campaignRecipientList?.length > 0;

  const tableEmptyState = {
    isEmpty: !doesSmartlistHaveCampaignSent,
    emptyConfig: {
      subtitle: t("table.campaignSent.emptyState.description"),
    },
  };

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      emptyStateProps={tableEmptyState}
      paginationProps={{
        currentPage,
        rowsPerPage: currentPageSize,
        totalItems: count,
        onPageSettingsChange: setPageSettings,
      }}
    />
  );
};
