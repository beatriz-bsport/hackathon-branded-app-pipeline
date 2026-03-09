import { useState } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";

import { CommunicationKind } from "#src/api/constants";
import { StreamlinedCommunicationStatus } from "#src/utils/types";

import { QueryBoundary } from "../QueryBoundary";
import { CampaignSentContentPreview } from "./CampaignSentContentPreview";
import { CampaignSentMetadataBanner } from "./CampaignSentMetadataBanner";
import { CampaignSentPerformance } from "./CampaignSentPerformance";
import { CampaignSentRecipientTable } from "./CampaignSentRecipientTable";

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
    openRate?: string;
    clickRate?: string;
    totalOpened?: number;
    totalClicked?: number;
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
    <div className="flex flex-col gap-lg">
      <CampaignSentMetadataBanner
        campaignKind={campaignKind}
        campaignStatus={campaignStatus}
        campaignDate={campaignDate}
        campaignTotalRecipients={campaignTotalRecipients}
        onPreview={() => setIsContentPreviewOpen(true)}
      />
      <QueryBoundary>
        <CampaignSentPerformance
          campaignUuid={campaignUuid}
          openRate={performance.openRate}
          clickRate={performance.clickRate}
          totalOpened={performance.totalOpened}
          totalClicked={performance.totalClicked}
        />
      </QueryBoundary>
      <QueryBoundary>
        <CampaignSentRecipientTable
          campaignUuid={campaignUuid}
          campaignKind={campaignKind}
        />
      </QueryBoundary>
      <QueryBoundary>
        <CampaignSentContentPreview
          open={isContentPreviewOpen}
          onClose={() => setIsContentPreviewOpen(false)}
          campaignKind={campaignKind}
          campaignContent={campaignContent}
          companyName={companyTheme?.company_name || ""}
        />
      </QueryBoundary>
    </div>
  );
};
