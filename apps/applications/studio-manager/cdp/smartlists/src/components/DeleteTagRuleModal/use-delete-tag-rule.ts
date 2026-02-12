import { useQueryClient } from "@tanstack/react-query";

import { toast } from "@bsport/kaizen-primitive-core";

import { smartlistKeys } from "#src/api/api";
import { useDeleteTagRule as useDeleteTagRuleMutation } from "#src/api/use-delete-tag-rule";
import { useTranslation } from "#src/utils/i18n";

export const useDeleteTagRule = () => {
  const { t } = useTranslation("details");

  const queryClient = useQueryClient();

  const { deleteTagRule: deleteTrigger, isLoading: isDeleting } =
    useDeleteTagRuleMutation({
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: smartlistKeys.tagRules(variables.smartlistId),
        });

        toast({
          status: "default",
          icon: "trash-01",
          title: t("automation.tagRules.toasts.success.deleted"),
          buttonIcon: "x-close",
        });
      },
      onError: () => {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("automation.tagRules.toasts.error.deleteFailed"),
          buttonIcon: "x-close",
        });
      },
    });

  const deleteTagRule = (params: {
    smartlistId: string;
    tagRuleId: number;
  }) => {
    deleteTrigger({ id: params.tagRuleId, smartlistId: params.smartlistId });
  };

  return {
    deleteTagRule,
    isDeleting,
  } as const;
};
