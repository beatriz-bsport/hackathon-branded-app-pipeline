import { useState } from "react";

import { dataAccessLayer } from "@bsport/sm-backbone";

import type { CommunicationKind } from "#src/api/constants";

import { CampaignScheduledContentPreview } from "./CampaignScheduledContentPreview";
import { CampaignScheduledMetadataBanner } from "./CampaignScheduledMetadataBanner";

export type CampaignScheduledDetailsProps = {
  campaignUuid: string;
  campaignKind: CommunicationKind;
  campaignDate: string;
  campaignContent: {
    subject: string;
    body: string;
    emailTemplateId?: number;
  };
};

export const CampaignScheduledDetails = ({
  campaignKind,
  campaignDate,
  campaignContent,
}: CampaignScheduledDetailsProps) => {
  const [isContentPreviewOpen, setIsContentPreviewOpen] = useState(false);
  const companyTheme = dataAccessLayer.useCompanyTheme();

  return (
    <div>
      <CampaignScheduledMetadataBanner
        campaignKind={campaignKind}
        campaignDate={campaignDate}
        onPreview={() => setIsContentPreviewOpen(true)}
      />
      <CampaignScheduledContentPreview
        open={isContentPreviewOpen}
        onClose={() => setIsContentPreviewOpen(false)}
        campaignKind={campaignKind}
        campaignContent={campaignContent}
        companyName={companyTheme?.company_name || ""}
      />
    </div>
  );
};
