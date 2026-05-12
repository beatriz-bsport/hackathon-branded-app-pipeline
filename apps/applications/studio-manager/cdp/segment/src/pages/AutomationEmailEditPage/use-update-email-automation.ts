import { toast } from "@bsport/kaizen-primitive-core";

import { useUpdateAutomatedCampaign } from "#src/api/use-update-automated-campaign";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { automationEmailFormDataToPayload } from "../AutomationEmailCreationPage/mappers";
import { type AutomationEmailFormData } from "../AutomationEmailCreationPage/types";

export const useUpdateEmailAutomation = ({
  smartlistId,
  entityId,
}: {
  smartlistId: string;
  entityId: string;
}) => {
  const { t } = useTranslation("details");
  const { navigateToSmartlistEmailAutomationMessage } =
    useSmartlistNavigation();

  const { updateAutomatedCampaign } = useUpdateAutomatedCampaign({
    onSuccess: () => {
      toast({
        status: "positive",
        icon: "check",
        description: t("automation.email.toasts.success.saved"),
        buttonIcon: "x-close",
      });

      navigateToSmartlistEmailAutomationMessage(smartlistId, entityId);
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.email.toasts.error.updateFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const updateEmailAutomation = async (data: AutomationEmailFormData) => {
    const automationId = Number(entityId);

    invariant(
      Number.isInteger(automationId) && automationId > 0,
      `Expected entityId to be a positive integer, got: ${entityId}`,
    );

    await updateAutomatedCampaign({
      id: automationId,
      ...automationEmailFormDataToPayload(data),
    });
  };

  return {
    updateEmailAutomation,
  } as const;
};
