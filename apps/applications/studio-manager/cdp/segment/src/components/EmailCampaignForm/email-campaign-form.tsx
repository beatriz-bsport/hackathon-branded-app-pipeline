import React from "react";

import type { CommunicationPreviewRecipientsRequest } from "@bsport/api-cdp/communicate";
import { ControlledForm, type ControlledFormProps } from "@bsport/form";
import { Card } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CampaignDeliveryModeSelector } from "#src/components/campaign-generic-fields/campaign-delivery-mode-selector";
import { useTranslation } from "#src/utils/i18n";

import { ContentSection } from "./content-section";
import { RecipientCountPreview } from "./recipient-count-preview";
import type { EmailCampaignFormData } from "./types.ts";

type EmailCampaignRecipientTarget = Extract<
  CommunicationPreviewRecipientsRequest["target"],
  { type: "smartlist" | "segment" }
>;

type EmailCampaignFormTargetProps =
  | {
      smartlistId: number;
      recipientTarget?: never;
    }
  | {
      smartlistId?: never;
      recipientTarget: EmailCampaignRecipientTarget;
    };

type EmailCampaignFormProps = Omit<
  ControlledFormProps<EmailCampaignFormData>,
  "children"
> &
  EmailCampaignFormTargetProps;

export const EmailCampaignForm: React.FC<EmailCampaignFormProps> = ({
  id,
  onSubmit,
  smartlistId,
  recipientTarget,
  ...methods
}) => {
  const { i18n } = useTranslation("campaign");
  const companyTheme = dataAccessLayer.useCompanyTheme();

  return (
    <ControlledForm
      id={id}
      onSubmit={onSubmit}
      className="flex flex-col gap-md"
      {...methods}
    >
      <Card padding="default" elevated className="flex flex-col gap-md">
        {recipientTarget !== undefined ? (
          <RecipientCountPreview target={recipientTarget} isMarketing />
        ) : (
          <RecipientCountPreview smartlistId={smartlistId} isMarketing />
        )}
      </Card>
      <CampaignDeliveryModeSelector
        companyTimezone={companyTheme?.timezone_name ?? "UTC"}
        locale={i18n.language}
        earliestHourToSend={companyTheme?.earliest_hour_to_send_communications}
        latestHourToSend={companyTheme?.latest_hour_to_send_communications}
      />
      <ContentSection />
    </ControlledForm>
  );
};
