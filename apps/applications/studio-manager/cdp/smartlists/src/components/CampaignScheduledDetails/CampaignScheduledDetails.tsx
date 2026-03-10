import { useState } from "react";

import { Alert, Card, Title } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import type { CommunicationKind } from "#src/api/constants";
import { useTranslation } from "#src/utils/i18n";

import { QueryBoundary } from "../QueryBoundary";
import { CampaignScheduledContentPreview } from "./CampaignScheduledContentPreview";
import { CampaignScheduledMetadataBanner } from "./CampaignScheduledMetadataBanner";
import { CampaignScheduledRecipientTable } from "./CampaignScheduledRecipientTable";

export type CampaignScheduledDetailsProps = {
  campaignScheduledId: number;
  campaignKind: CommunicationKind;
  campaignDate: string;
  campaignContent: {
    subject: string;
    body: string;
    emailTemplateId?: number;
  };
};

export const CampaignScheduledDetails = ({
  campaignScheduledId,
  campaignKind,
  campaignDate,
  campaignContent,
}: CampaignScheduledDetailsProps) => {
  const { t } = useTranslation("campaign");
  const [isContentPreviewOpen, setIsContentPreviewOpen] = useState(false);
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { currentPage, currentPageSize } = usePaginationQueryParams();

  return (
    <div className="flex flex-col gap-lg">
      <CampaignScheduledMetadataBanner
        campaignScheduledId={campaignScheduledId}
        campaignKind={campaignKind}
        campaignDate={campaignDate}
        onPreview={() => setIsContentPreviewOpen(true)}
      />
      <div className="flex flex-col gap-sm">
        <Title htmlVariant="h2" weight="strong">
          {t("table.campaignScheduled.recipientsList.title")}
        </Title>
        <Alert status="default" type="weak">
          {t("table.campaignScheduled.recipientsList.description")}
        </Alert>

        <Card padding="none">
          <QueryBoundary
            key={`${campaignScheduledId}-${currentPage}-${currentPageSize}`}
          >
            <CampaignScheduledRecipientTable
              campaignScheduledId={campaignScheduledId}
              campaignKind={campaignKind}
            />
          </QueryBoundary>
        </Card>
      </div>
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
