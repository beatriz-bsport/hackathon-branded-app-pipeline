import React from "react";

import { ControlledForm, type ControlledFormProps } from "@bsport/form";

import { CampaignNameField } from "#src/components/campaign-generic-fields/campaign-name-field";

import type { PushCampaignFormData } from "./types";

type PushCampaignFormProps = Omit<
  ControlledFormProps<PushCampaignFormData>,
  "children"
>;

export const PushCampaignForm: React.FC<PushCampaignFormProps> = ({
  id,
  onSubmit,
  ...methods
}) => {
  return (
    <ControlledForm
      id={id}
      onSubmit={onSubmit}
      className="flex flex-col gap-md"
      {...methods}
    >
      <CampaignNameField<PushCampaignFormData> />
    </ControlledForm>
  );
};
