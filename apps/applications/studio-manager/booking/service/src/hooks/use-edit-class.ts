import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type EditGroupActivityPayload,
  editGroupActivity,
  groupActivityKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const editClass = editGroupActivity.bind(null, xhr);

export const useEditClass = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("list");

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: EditGroupActivityPayload;
    }) => editClass(id, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: groupActivityKeys.all });
      queryClient.invalidateQueries({
        queryKey: groupActivityKeys.detail(id),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("list.toasts.editError"),
      });
    },
  });
};
