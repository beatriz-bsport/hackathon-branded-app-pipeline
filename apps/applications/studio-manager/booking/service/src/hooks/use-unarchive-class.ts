import { useMutation, useQueryClient } from "@tanstack/react-query";

import { groupActivityKeys, unarchiveGroupActivity } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const unarchiveClass = unarchiveGroupActivity.bind(null, fetch);

export const useUnarchiveClass = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("list");

  return useMutation({
    mutationFn: (id: number) => unarchiveClass(id.toString()),
    onSuccess: ({ name }) => {
      queryClient.invalidateQueries({ queryKey: groupActivityKeys.all });
      toast({
        status: "default",
        icon: "flip-forward",
        buttonIcon: "x",
        description: t("list.toasts.unarchive", { className: name }),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("list.toasts.unarchiveError"),
      });
    },
  });
};
