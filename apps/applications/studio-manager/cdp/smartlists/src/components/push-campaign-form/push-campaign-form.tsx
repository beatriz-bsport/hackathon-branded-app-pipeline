import React from "react";

import { ControlledForm, type ControlledFormProps } from "@bsport/form";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CampaignDeliveryModeSelector } from "#src/components/campaign-generic-fields/campaign-delivery-mode-selector";
import { CampaignNameField } from "#src/components/campaign-generic-fields/campaign-name-field";
import { useTranslation } from "#src/utils/i18n";

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
  const { i18n } = useTranslation("campaign");
  const companyTheme = dataAccessLayer.useCompanyTheme();

  return (
    <ControlledForm
      id={id}
      onSubmit={onSubmit}
      className="flex flex-col gap-md"
      {...methods}
    >
      <CampaignNameField<PushCampaignFormData> />
      <CampaignDeliveryModeSelector<PushCampaignFormData>
        companyTimezone={companyTheme?.timezone_name ?? "UTC"}
        locale={i18n.language}
        earliestHourToSend={companyTheme?.earliest_hour_to_send_communications}
        latestHourToSend={companyTheme?.latest_hour_to_send_communications}
      />
    </ControlledForm>
  );
};
