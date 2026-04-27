import { Alert, Body, Divider, Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CommunicationKind } from "#src/api/constants";
import type { CampaignSent } from "#src/api/types";
import { HTMLPreview } from "#src/components/BusinessComponents/HTMLPreview";
import { PushNotificationPreview } from "#src/components/BusinessComponents/PushNotificationPreview";
import {
  getFallbackCampaignContent,
  getFallbackCampaignTitle,
} from "#src/utils/campaignUtils";
import { useTranslation } from "#src/utils/i18n";

type CampaignSentPreviewModalProps = {
  campaignSent: CampaignSent;
  onClose: () => void;
};

export const CampaignSentPreviewModal = ({
  campaignSent,
  onClose,
}: CampaignSentPreviewModalProps) => {
  const { t } = useTranslation("campaign");
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const campaignTitle = getFallbackCampaignTitle(campaignSent);
  const campaignContent = getFallbackCampaignContent(campaignSent);
  const campaignKind = campaignSent.kind;

  return (
    <Modal
      open
      size="lg"
      title={t("campaignDetails.metadataBanner.previewButton")}
      onClose={onClose}
      onClickOutside={onClose}
    >
      <div className="flex flex-col gap-sm">
        <div className="flex flex-col gap-xs">
          {campaignKind === CommunicationKind.EMAIL ? (
            <div className="flex">
              <Body htmlVariant="p" weight="strong" color="weaker" size="sm">
                {t("campaignDetails.metadataBanner.contentPreview.subject")}
              </Body>
              <Body htmlVariant="span" weight="stronger">
                {campaignTitle}
              </Body>
              <Divider orientation="horizontal" weight="thin" />
            </div>
          ) : null}
          <Alert status="default" type="weak">
            {t(
              "campaignDetails.metadataBanner.contentPreview.dynamicContentWarning",
            )}
          </Alert>
        </div>

        <Divider orientation="horizontal" weight="thin" />

        {campaignKind === CommunicationKind.EMAIL ? (
          <HTMLPreview htmlContent={campaignContent} />
        ) : null}

        {campaignKind === CommunicationKind.SMS ||
        campaignKind === CommunicationKind.PUSH ? (
          <PushNotificationPreview
            title={campaignTitle}
            content={campaignContent}
            sender={companyTheme?.company_name || ""}
          />
        ) : null}
      </div>
    </Modal>
  );
};
