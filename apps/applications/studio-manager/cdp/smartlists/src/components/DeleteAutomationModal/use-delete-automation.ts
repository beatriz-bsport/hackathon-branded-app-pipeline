import { useQueryClient } from "@tanstack/react-query";

import { toast } from "@bsport/kaizen-primitive-core";

import { smartlistKeys } from "#src/api/api";
import { useDeleteAutomatedCampaign } from "#src/api/use-delete-automated-campaign";
import { useTranslation } from "#src/utils/i18n";

export const useDeleteAutomation = () => {
  const { t } = useTranslation("details");

  const queryClient = useQueryClient();

  const { deleteAutomatedCampaign: deleteTrigger, isLoading: isDeleting } =
    useDeleteAutomatedCampaign({
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: smartlistKeys.automatedCampaigns(variables.smartlistId),
        });

        toast({
          status: "default",
          icon: "trash-01",
          title: t("automation.messages.toasts.success.deleted"),
          buttonIcon: "x-close",
        });
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
