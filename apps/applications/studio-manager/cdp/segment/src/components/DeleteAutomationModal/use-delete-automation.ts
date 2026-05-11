import { toast } from "@bsport/kaizen-primitive-core";

import { useDeleteAutomatedCampaign } from "#src/api/use-delete-automated-campaign";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { useTranslation } from "#src/utils/i18n";

export const useDeleteAutomation = () => {
  const { navigateToSmartlistAutomation } = useSmartlistNavigation();

  const { t } = useTranslation("details");

  const { deleteAutomatedCampaign: deleteTrigger, isLoading: isDeleting } =
    useDeleteAutomatedCampaign({
      onSuccess: (_data, variables) => {
        toast({
          status: "default",
          icon: "trash-01",
          title: t("automation.messages.toasts.success.deleted"),
          buttonIcon: "x-close",
        });

        navigateToSmartlistAutomation(variables.smartlistId);
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("automation.messages.toasts.error.deleteFailed"),
          buttonIcon: "x-close",
        });
      },
    });

  const deleteAutomation = (params: {
    smartlistId: string;
    automationId: number;
  }) => {
    deleteTrigger({ id: params.automationId, smartlistId: params.smartlistId });
  };

  return {
    deleteAutomation,
    isDeleting,
  } as const;
};
