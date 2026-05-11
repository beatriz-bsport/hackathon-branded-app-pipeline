import { toast } from "@bsport/kaizen-primitive-core";

import { useUpdateAutomatedCampaign } from "#src/api/use-update-automated-campaign";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
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
  const { navigateToSmartlistPushAutomationMessage } = useSmartlistNavigation();

  const { updateAutomatedCampaign } = useUpdateAutomatedCampaign({
    onSuccess: () => {
      toast({
        status: "positive",
        icon: "check",
        description: t("automation.push.toasts.success.saved"),
        buttonIcon: "x-close",
      });

      navigateToSmartlistPushAutomationMessage(smartlistId, entityId);
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
