import React from "react";

import { ControlledForm, type ControlledFormProps } from "@bsport/form";
import { Card } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CampaignDeliveryModeSelector } from "#src/components/campaign-generic-fields/campaign-delivery-mode-selector";
import { CampaignNameField } from "#src/components/campaign-generic-fields/campaign-name-field";
import { SmsContent } from "#src/components/sms-content-generic-field/sms-content";
import { useTranslation } from "#src/utils/i18n";

import { SmsRecipientCountPreview } from "./recipient-count-preview";
import type { SmsCampaignFormData } from "./types";

type SmsCampaignFormProps = Omit<
  ControlledFormProps<SmsCampaignFormData>,
  "children"
> & {
  smartlistId: number;
};

export const SmsCampaignForm: React.FC<SmsCampaignFormProps> = ({
  id,
  onSubmit,
  smartlistId,
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
        <SmsRecipientCountPreview smartlistId={smartlistId} />
      </Card>
      <CampaignNameField />
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
