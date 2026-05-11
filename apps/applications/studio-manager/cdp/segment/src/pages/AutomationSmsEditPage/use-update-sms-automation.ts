import { toast } from "@bsport/kaizen-primitive-core";

import { useUpdateAutomatedCampaign } from "#src/api/use-update-automated-campaign";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { useTranslation } from "#src/utils/i18n";

import { smsAutomationFormDataToPayload } from "../AutomationSmsCreationPage/mappers";
import { type SmsAutomationFormData } from "../AutomationSmsCreationPage/types";

export const useUpdateSmsAutomation = ({
  smartlistId,
  entityId,
}: {
  smartlistId: string;
  entityId: string;
}) => {
  const { t } = useTranslation("details");
  const { navigateToSmartlistSmsAutomationMessage } = useSmartlistNavigation();

  const { updateAutomatedCampaign } = useUpdateAutomatedCampaign({
    onSuccess: () => {
      toast({
        status: "positive",
        icon: "check",
        description: t("automation.sms.toasts.success.saved"),
        buttonIcon: "x-close",
      });

      navigateToSmartlistSmsAutomationMessage(smartlistId, entityId);
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.sms.toasts.error.updateFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const updateSmsAutomation = async (data: SmsAutomationFormData) => {
    await updateAutomatedCampaign({
      id: +entityId,
      ...smsAutomationFormDataToPayload(data),
    });
  };

  return {
    updateSmsAutomation,
  } as const;
};
