import React from "react";

import { ControlledForm, type ControlledFormProps } from "@bsport/form";
import { Card } from "@bsport/kaizen-primitive-core";

import { EMAIL_TYPE_MARKETING } from "./constants";
import { EmailTypeField } from "./email-type-field";
import { RecipientCountPreview } from "./recipient-count-preview";
import type { EmailCampaignFormData } from "./types";

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
    </ControlledForm>
  );
};
