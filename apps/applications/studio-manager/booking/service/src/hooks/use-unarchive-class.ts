import { useMutation, useQueryClient } from "@tanstack/react-query";

import { groupActivityKeys, unarchiveGroupActivity } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const unarchiveClass = unarchiveGroupActivity.bind(null, fetch);

export const useUnarchiveClass = ({
  onSuccess,
}: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("class-actions");

  return useMutation({
    mutationFn: (id: number) => unarchiveClass(id.toString()),
    onSuccess: ({ name: _name }) => {
      queryClient.invalidateQueries({ queryKey: groupActivityKeys.all });
      onSuccess?.();
      toast({
        status: "default",
        icon: "flip-forward",
        buttonIcon: "x",
        description: t("classActions.toasts.unarchive"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("classActions.toasts.unarchiveError"),
      });
    },
  });
};
