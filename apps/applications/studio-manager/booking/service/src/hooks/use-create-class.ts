import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateGroupActivityPayload,
  createGroupActivity,
  groupActivityKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const createClass = createGroupActivity.bind(null, xhr);

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("list");

  return useMutation({
    mutationFn: (data: CreateGroupActivityPayload) => createClass(data),
    onSuccess: ({ name }) => {
      queryClient.invalidateQueries({ queryKey: groupActivityKeys.all });
      toast({
        status: "default",
        icon: "check-circle",
        description: t("list.toasts.create", { className: name }),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("list.toasts.createError"),
      });
    },
  });
};
