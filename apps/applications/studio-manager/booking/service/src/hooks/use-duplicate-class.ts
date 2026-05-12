import { useMutation, useQueryClient } from "@tanstack/react-query";

import { duplicateGroupActivity, groupActivityKeys } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const duplicateClass = duplicateGroupActivity.bind(null, fetch);

export const useDuplicateClass = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("class-actions");

  return useMutation({
    mutationFn: (id: number) => duplicateClass(id.toString()),
    onSuccess: ({ name: _name }) => {
      queryClient.invalidateQueries({ queryKey: groupActivityKeys.all });
      onSuccess?.();
      toast({
        status: "default",
        icon: "copy-03",
        buttonIcon: "x",
        description: t("classActions.toasts.duplication"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("classActions.toasts.duplicationError"),
      });
    },
  });
};
