import {
  Alert,
  Body,
  DetailDrawer,
  Divider,
} from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { useFetchEmailTemplateDetail } from "#src/api/use-fetch-email-template-detail";
import { HTMLPreview } from "#src/components/BusinessComponents/HTMLPreview";
import { PushNotificationPreview } from "#src/components/BusinessComponents/PushNotificationPreview";
import { useTranslation } from "#src/utils/i18n";

import { QueryBoundary } from "../QueryBoundary";

type CampaignSentContentPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  campaignContent: {
    subject: string;
    body?: string;
    emailTemplateId?: number;
  };
  campaignKind: CommunicationKind;
  companyName: string;
};
export const CampaignScheduledContentPreview = ({
  open,
  onClose,
  campaignContent,
  campaignKind,
  companyName,
}: CampaignSentContentPreviewModalProps) => {
  const { t } = useTranslation("campaign");
  return (
    <DetailDrawer
      className="w-[600px]"
      isOpen={open}
      onClose={onClose}
      id="campaign-content-preview"
    >
      <div className="flex flex-col gap-xs">
        <>
          {campaignKind === CommunicationKind.EMAIL && (
            <>
              <Body htmlVariant="p" weight="strong" color="weaker" size="sm">
                {t("campaignDetails.metadataBanner.contentPreview.subject")}
              </Body>
              <Body htmlVariant="span" weight="stronger">
                {campaignContent.subject}
              </Body>
              <Divider orientation="horizontal" weight="thin" />
            </>
          )}
          <Alert status="default" type="weak">
            {t(
              "campaignDetails.metadataBanner.contentPreview.dynamicContentWarning",
            )}
          </Alert>
        </>
      </div>
      <Divider orientation="horizontal" weight="thin" />
      {campaignContent.emailTemplateId ? (
        <QueryBoundary>
          <CampaignScheduledContentPreviewEmail
            emailTemplateId={campaignContent.emailTemplateId}
          />
        </QueryBoundary>
      ) : campaignKind === CommunicationKind.EMAIL ? (
        <HTMLPreview htmlContent={campaignContent.body ?? ""} />
      ) : null}
      {campaignKind === CommunicationKind.SMS ||
      campaignKind === CommunicationKind.PUSH ? (
        <PushNotificationPreview
          title={campaignContent.subject}
          content={campaignContent.body ?? ""}
          sender={companyName}
        />
      ) : null}
    </DetailDrawer>
  );
};

export const CampaignScheduledContentPreviewEmail = ({
  emailTemplateId,
}: {
  emailTemplateId: number;
}) => {
  const { data: emailTemplateDetail } = useFetchEmailTemplateDetail({
    emailTemplateId,
  });
  return <HTMLPreview htmlContent={emailTemplateDetail?.html ?? ""} />;
};
