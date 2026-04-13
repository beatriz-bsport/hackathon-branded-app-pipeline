import { useNavigate } from "react-router";

import { toast } from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { useCreateAutomatedCampaign } from "#src/api/use-create-automated-campaign";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { smsAutomationFormDataToPayload } from "./mappers";
import { type SmsAutomationFormData } from "./types";

export const useCreateSmsAutomation = ({
  smartlistId,
}: {
  smartlistId: string;
}) => {
  const { t } = useTranslation("details");
  const navigate = useNavigate();

  const { createAutomatedCampaign } = useCreateAutomatedCampaign({
    onSuccess: () => {
      toast({
        status: "positive",
        icon: "check",
        description: t("automation.sms.toasts.success.created"),
        buttonIcon: "x-close",
      });
      navigate(SMARTLIST_APP_LINKS.automation(smartlistId));
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.sms.toasts.error.createFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const createSmsAutomation = (data: SmsAutomationFormData) =>
    createAutomatedCampaign({
      smartlist: Number(smartlistId),
      communication_kind: CommunicationKind.SMS,
      ...smsAutomationFormDataToPayload(data),
    });

  return {
    createSmsAutomation,
  } as const;
};
