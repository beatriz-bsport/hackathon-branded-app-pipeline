import { useNavigate } from "react-router";

import { toast } from "@bsport/kaizen-primitive-core";

import { CommunicationKind } from "#src/api/constants";
import { useCreateAutomatedCampaign } from "#src/api/use-create-automated-campaign";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { pushAutomationFormDataToPayload } from "./mappers";
import { type PushAutomationFormData } from "./types";

export const useCreatePushAutomation = ({
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
        description: t("automation.push.toasts.success.created"),
        buttonIcon: "x-close",
      });
      navigate(SMARTLIST_APP_LINKS.automation(smartlistId));
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.push.toasts.error.createFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const createPushAutomation = async (data: PushAutomationFormData) => {
    await createAutomatedCampaign({
      smartlist: Number(smartlistId),
      communication_kind: CommunicationKind.PUSH,
      ...pushAutomationFormDataToPayload(data),
    });
  };

  return {
    createPushAutomation,
  } as const;
};
