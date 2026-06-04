import React from "react";

import type { CommunicationPreviewRecipientsRequest } from "@bsport/api-cdp/communicate";
import { getEnv } from "@bsport/envs";
import { ControlledForm, type ControlledFormProps } from "@bsport/form";
import { Card } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CampaignDeliveryModeSelector } from "#src/components/campaign-generic-fields/campaign-delivery-mode-selector";
import { CampaignNameField } from "#src/components/campaign-generic-fields/campaign-name-field";
import { useTranslation } from "#src/utils/i18n";

import { EMAIL_TYPE_MARKETING } from "./constants";
import { ContentSection } from "./content-section";
import { EmailTypeField } from "./email-type-field";
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
  const { watch } = methods;
  const { i18n } = useTranslation("campaign");
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const selectedEmailType = watch("emailType");
  const isProduction = getEnv() === "production";

  return (
    <ControlledForm
      id={id}
      onSubmit={onSubmit}
      className="flex flex-col gap-md"
      {...methods}
    >
      <Card padding="default" elevated className="flex flex-col gap-md">
        <EmailTypeField />
        {recipientTarget !== undefined ? (
          <RecipientCountPreview
            target={recipientTarget}
            isMarketing={selectedEmailType === EMAIL_TYPE_MARKETING}
          />
        ) : (
          <RecipientCountPreview
            smartlistId={smartlistId}
            isMarketing={selectedEmailType === EMAIL_TYPE_MARKETING}
          />
        )}
      </Card>
      {
        /**
         * Only show the campaign name field if not in production
         * This feature is not developed yet in backend
         * TODO: Remove this once the feature is developed in backend
         */
        isProduction ? null : <CampaignNameField />
      }
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
