import React from "react";

import { getEnv } from "@bsport/envs";
import { ControlledForm, type ControlledFormProps } from "@bsport/form";
import { Card } from "@bsport/kaizen-primitive-core";

import { EmailNameField } from "./EmailNameField";
import { CampaignDeliveryModeSelector } from "./campaign-delivery-mode-selector";
import { EMAIL_TYPE_MARKETING } from "./constants";
import { EmailTypeField } from "./email-type-field";
import { RecipientCountPreview } from "./recipient-count-preview";
import type { EmailCampaignFormData } from "./types.ts";

type EmailCampaignFormProps = Omit<
  ControlledFormProps<EmailCampaignFormData>,
  "children"
> & {
  smartlistId: number;
};

export const EmailCampaignForm: React.FC<EmailCampaignFormProps> = ({
  id,
  onSubmit,
  smartlistId,
  ...methods
}) => {
  const { watch } = methods;

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
        <RecipientCountPreview
          smartlistId={smartlistId}
          isMarketing={selectedEmailType === EMAIL_TYPE_MARKETING}
        />
      </Card>
      {
        /**
         * Only show the campaign name field if not in production
         * This feature is not developed yet in backend
         * TODO: Remove this once the feature is developed in backend
         */
        isProduction ? null : <EmailNameField />
      }
      <CampaignDeliveryModeSelector />
    </ControlledForm>
  );
};
