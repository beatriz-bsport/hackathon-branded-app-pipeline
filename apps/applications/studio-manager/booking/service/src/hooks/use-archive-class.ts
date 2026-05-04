import { useMutation, useQueryClient } from "@tanstack/react-query";

import { archiveGroupActivity, groupActivityKeys } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { useUnarchiveClass } from "./use-unarchive-class";

const archiveClass = archiveGroupActivity.bind(null, fetch);
const ARCHIVE_CLASS_SUCESS_TOAST_DURATION = 5000;

export const useArchiveClass = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("list");
  const { mutate: unarchive } = useUnarchiveClass();

  return useMutation({
    mutationFn: (id: number) => archiveClass(id.toString()),
    onSuccess: ({ id, name }) => {
      queryClient.invalidateQueries({ queryKey: groupActivityKeys.all });
      onSuccess?.();
      toast({
        status: "default",
        icon: "archive",
        description: t("list.toasts.archive", { className: name }),
        duration: ARCHIVE_CLASS_SUCESS_TOAST_DURATION,
        buttonLabel: t("list.toasts.undo"),
        onButtonClick: () => unarchive(id),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("list.toasts.archiveError"),
      });
    },
  });
};
