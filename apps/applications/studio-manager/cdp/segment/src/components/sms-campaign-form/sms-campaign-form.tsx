import React from "react";

import type { CommunicationPreviewRecipientsRequest } from "@bsport/api-cdp/communicate";
import { ControlledForm, type ControlledFormProps } from "@bsport/form";
import { Card } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CampaignDeliveryModeSelector } from "#src/components/campaign-generic-fields/campaign-delivery-mode-selector";
import { SmsContent } from "#src/components/sms-content-generic-field/sms-content";
import { useTranslation } from "#src/utils/i18n";

import { SmsRecipientCountPreview } from "./recipient-count-preview";
import type { SmsCampaignFormData } from "./types";

type SmsCampaignRecipientTarget = Extract<
  CommunicationPreviewRecipientsRequest["target"],
  { type: "smartlist" | "segment" }
>;

type SmsCampaignFormTargetProps =
  | {
      smartlistId: number;
      recipientTarget?: never;
    }
  | {
      smartlistId?: never;
      recipientTarget: SmsCampaignRecipientTarget;
    };

type SmsCampaignFormProps = Omit<
  ControlledFormProps<SmsCampaignFormData>,
  "children"
> &
  SmsCampaignFormTargetProps;

export const SmsCampaignForm: React.FC<SmsCampaignFormProps> = ({
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
          <SmsRecipientCountPreview target={recipientTarget} />
        ) : (
          <SmsRecipientCountPreview smartlistId={smartlistId} />
        )}
      </Card>
      <CampaignDeliveryModeSelector
        companyTimezone={companyTheme?.timezone_name ?? "UTC"}
        locale={i18n.language}
        earliestHourToSend={companyTheme?.earliest_hour_to_send_communications}
        latestHourToSend={companyTheme?.latest_hour_to_send_communications}
      />
      <SmsContent />
    </ControlledForm>
  );
};
