import { useParams } from "react-router";

import { Table, toast } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { CommunicationKind } from "#src/api/constants";
import { useFetchCommunicationRecipientsPreview } from "#src/api/use-fetch-communication-recipients-preview";
import { SMARTLIST_LEGACY_URLS } from "#src/urls";
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
  const { id: smartlistId } = useParams<{ id: string }>();
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
      window.open(MEMBER_PROFILE_URL(memberId), "_blank");
    },
    copyContactInfo: async (contactInfo: string) => {
      if (!navigator?.clipboard?.writeText) {
        toast({
          status: "critical",
          icon: "alert-circle",
          description: t("table.campaignRecipient.copyContactInfo.error"),
          buttonIcon: "x-close",
        });
        return;
      }

      try {
        await navigator.clipboard.writeText(contactInfo);
        toast({
          status: "positive",
          icon: "check",
          description: t("table.campaignRecipient.copyContactInfo.success"),
          buttonIcon: "x-close",
        });
      } catch (error) {
        console.error(error);
        toast({
          status: "critical",
          icon: "alert-circle",
          description: t("table.campaignRecipient.copyContactInfo.error"),
          buttonIcon: "x-close",
        });
      }
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
