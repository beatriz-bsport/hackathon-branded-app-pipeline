import { useNavigate } from "react-router";

import { toast } from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { useCreateAutomatedCampaign } from "#src/api/use-create-automated-campaign";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { automationEmailFormDataToPayload } from "./mappers";
import type { AutomationEmailFormData } from "./types";

export const useCreateEmailAutomation = ({
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
        description: t("automation.email.toasts.success.created"),
        buttonIcon: "x-close",
      });
      navigate(SMARTLIST_APP_LINKS.automation(smartlistId));
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.email.toasts.error.createFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const createEmailAutomation = async (data: AutomationEmailFormData) => {
    await createAutomatedCampaign({
      smartlist: Number(smartlistId),
      communication_kind: CommunicationKind.EMAIL,
      ...automationEmailFormDataToPayload(data),
    });
  };

  return {
    createEmailAutomation,
  } as const;
};
