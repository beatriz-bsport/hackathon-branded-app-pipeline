import React from "react";

import { ControlledForm, type ControlledFormProps } from "@bsport/form";
import { Alert } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CampaignDeliveryModeSelector } from "#src/components/campaign-generic-fields/campaign-delivery-mode-selector";
import { PushNotificationContent } from "#src/components/push-notification-generic-field/push-notification-content";
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
  const { i18n, t } = useTranslation("campaign");
  const companyTheme = dataAccessLayer.useCompanyTheme();

  return (
    <ControlledForm
      id={id}
      onSubmit={onSubmit}
      className="flex flex-col gap-md"
      {...methods}
    >
      <Alert status="default">{t("push.creation.alertMessage")}</Alert>
      <CampaignDeliveryModeSelector
        companyTimezone={companyTheme?.timezone_name ?? "UTC"}
        locale={i18n.language}
        earliestHourToSend={companyTheme?.earliest_hour_to_send_communications}
        latestHourToSend={companyTheme?.latest_hour_to_send_communications}
      />
      <PushNotificationContent sender={companyTheme?.company_name ?? ""} />
    </ControlledForm>
  );
};
