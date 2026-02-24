import { CommunicationKind } from "#src/api/constants";
import { StreamlinedCommunicationStatus } from "#src/utils/types";

import { CampaignMetadataBanner } from "./CampaignMetadataBanner";

export type CampaignContentProps = {
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

export const CampaignContent = ({
  campaignKind,
  campaignStatus,
  campaignDate,
  campaignTotalRecipients,
  campaignContent,
}: CampaignContentProps) => {
  return (
    <div>
      <CampaignMetadataBanner
        campaignKind={campaignKind}
        campaignStatus={campaignStatus}
        campaignDate={campaignDate}
        campaignTotalRecipients={campaignTotalRecipients}
        campaignContent={campaignContent}
      />
    </div>
  );
};
