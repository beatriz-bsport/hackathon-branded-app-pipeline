import { useState } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";

import { CommunicationKind } from "#src/api/constants";
import { StreamlinedCommunicationStatus } from "#src/utils/types";

import { CampaignSentContentPreview } from "./CampaignSentContentPreview";
import { CampaignSentMetadataBanner } from "./CampaignSentMetadataBanner";

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
};

export const CampaignSentDetails = ({
  campaignKind,
  campaignStatus,
  campaignDate,
  campaignTotalRecipients,
  campaignContent,
}: CampaignSentDetailsProps) => {
  const [isContentPreviewOpen, setIsContentPreviewOpen] = useState(false);
  const companyTheme = dataAccessLayer.useCompanyTheme();

  return (
    <div>
      <CampaignSentMetadataBanner
        campaignKind={campaignKind}
        campaignStatus={campaignStatus}
        campaignDate={campaignDate}
        campaignTotalRecipients={campaignTotalRecipients}
        onPreview={() => setIsContentPreviewOpen(true)}
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
