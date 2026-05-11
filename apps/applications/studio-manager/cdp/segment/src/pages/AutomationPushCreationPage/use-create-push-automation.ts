import { CommunicationKind } from "@bsport/api-cdp/automated-campaign";
import { toast } from "@bsport/kaizen-primitive-core";

import { useCreateAutomatedCampaign } from "#src/api/use-create-automated-campaign";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { useTranslation } from "#src/utils/i18n";

import { pushAutomationFormDataToPayload } from "./mappers";
import { type PushAutomationFormData } from "./types";

export const useCreatePushAutomation = ({
  smartlistId,
}: {
  smartlistId: string;
}) => {
  const { t } = useTranslation("details");
  const { navigateToSmartlistAutomation } = useSmartlistNavigation();

  const { createAutomatedCampaign } = useCreateAutomatedCampaign({
    onSuccess: () => {
      toast({
        status: "positive",
        icon: "check",
        description: t("automation.push.toasts.success.created"),
        buttonIcon: "x-close",
      });
      navigateToSmartlistAutomation(smartlistId);
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
