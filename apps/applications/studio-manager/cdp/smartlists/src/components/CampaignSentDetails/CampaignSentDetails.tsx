import { useState } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";

import { CommunicationKind } from "#src/api/constants";
import { StreamlinedCommunicationStatus } from "#src/utils/types";

import { CampaignSentContentPreview } from "./CampaignSentContentPreview";
import { CampaignSentMetadataBanner } from "./CampaignSentMetadataBanner";
import { CampaignSentPerformance } from "./CampaignSentPerformance";

export type CampaignSentDetailsProps = {
  campaignUuid: string;
  campaignKind: CommunicationKind;
  campaignStatus?: StreamlinedCommunicationStatus;
  campaignDate: string;
  campaignTotalRecipients?: number;
  campaignContent: {
    subject: string;
    body: string;
    emailTemplateId?: number;
  };
  performance: {
    deliveryRate?: string;
    openRate?: string;
    clickRate?: string;
    unsubscribedRate?: string;
    totalOpened?: number;
    totalClicked?: number;
    totalUnsubscribed?: number;
  };
};

export const CampaignSentDetails = ({
  campaignUuid,
  campaignKind,
  campaignStatus,
  campaignDate,
  campaignTotalRecipients,
  campaignContent,
  performance,
}: CampaignSentDetailsProps) => {
  const [isContentPreviewOpen, setIsContentPreviewOpen] = useState(false);
  const companyTheme = dataAccessLayer.useCompanyTheme();

  return (
    <div className="flex flex-col gap-md">
      <CampaignSentMetadataBanner
        campaignKind={campaignKind}
        campaignStatus={campaignStatus}
        campaignDate={campaignDate}
        campaignTotalRecipients={campaignTotalRecipients}
        onPreview={() => setIsContentPreviewOpen(true)}
      />
      <CampaignSentPerformance
        campaignUuid={campaignUuid}
        deliveryRate={performance.deliveryRate}
        openRate={performance.openRate}
        clickRate={performance.clickRate}
        unsubscribedRate={performance.unsubscribedRate}
        totalRecipients={campaignTotalRecipients}
        totalOpened={performance.totalOpened}
        totalClicked={performance.totalClicked}
        totalUnsubscribed={performance.totalUnsubscribed}
      />
      <CampaignSentContentPreview
        open={isContentPreviewOpen}
        onClose={() => setIsContentPreviewOpen(false)}
        campaignKind={campaignKind}
        campaignContent={campaignContent}
        companyName={companyTheme?.company_name || ""}
      />
    </div>
  );
};
