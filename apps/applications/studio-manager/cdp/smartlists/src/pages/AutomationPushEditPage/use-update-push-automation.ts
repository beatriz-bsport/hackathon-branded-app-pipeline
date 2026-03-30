import { toast } from "@bsport/kaizen-primitive-core";

import { useUpdateAutomatedCampaign } from "#src/api/use-update-automated-campaign";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { CAMPAIGN_CHANNEL_PUSH } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { pushAutomationFormDataToPayload } from "../AutomationPushCreationPage/mappers";
import { type PushAutomationFormData } from "../AutomationPushCreationPage/types";

export const useUpdatePushAutomation = ({
  smartlistId,
  entityId,
}: {
  smartlistId: string;
  entityId: string;
}) => {
  const { t } = useTranslation("details");
  const { navigateToSmartlistAutomationMessage } = useSmartlistNavigation();

  const { updateAutomatedCampaign } = useUpdateAutomatedCampaign({
    onSuccess: () => {
      toast({
        status: "positive",
        icon: "check",
        description: t("automation.push.toasts.success.saved"),
        buttonIcon: "x-close",
      });

      navigateToSmartlistAutomationMessage(
        smartlistId,
        CAMPAIGN_CHANNEL_PUSH,
        entityId,
      );
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.push.toasts.error.updateFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const updatePushAutomation = async (data: PushAutomationFormData) => {
    await updateAutomatedCampaign({
      id: +entityId,
      ...pushAutomationFormDataToPayload(data),
    });
  };

  return {
    updatePushAutomation,
  } as const;
};
