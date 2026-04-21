import { useId } from "react";

import { Body, DetailDrawer, Divider } from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { HTMLPreview } from "#src/components/BusinessComponents/HTMLPreview";
import { PushNotificationPreview } from "#src/components/BusinessComponents/PushNotificationPreview";
import { useTranslation } from "#src/utils/i18n";

type PreviewDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  communicationKind: CommunicationKind;
  emailTemplateHtml?: string | null;
  emailTemplateId?: number | null;
  sender?: string | null;
  title?: string | null;
  content?: string | null;
};

export function PreviewDrawer({
  isOpen,
  onClose,
  communicationKind,
  emailTemplateHtml,
  emailTemplateId,
  sender,
  title,
  content,
}: PreviewDrawerProps) {
  const id = useId();
  const { t } = useTranslation("campaign");

  return (
    <DetailDrawer
      className="w-[600px]"
      isOpen={isOpen}
      onClose={onClose}
      id={id}
    >
      {communicationKind === CommunicationKind.EMAIL ? (
        <>
          <div className="flex flex-col gap-xs">
            <Body htmlVariant="p" weight="strong" color="weaker" size="sm">
              {t("campaignDetails.metadataBanner.contentPreview.subject")}
            </Body>
            <Body htmlVariant="span" weight="stronger">
              {title ?? ""}
            </Body>
            <Divider orientation="horizontal" weight="thin" />
          </div>
          <HTMLPreview
            htmlContent={
              typeof emailTemplateId === "number" && emailTemplateId > 0
                ? (emailTemplateHtml ?? "")
                : (content ?? "")
            }
          />
        </>
      ) : (
        <PushNotificationPreview
          sender={sender ?? ""}
          title={title ?? ""}
          content={content ?? ""}
        />
      )}
    </DetailDrawer>
  );
}
