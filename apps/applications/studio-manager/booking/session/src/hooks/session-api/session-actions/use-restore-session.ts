import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restoreSessionAPI, sessionKeys } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const restoreSession = restoreSessionAPI.bind(null, fetch);

export const useRestoreSession = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("sessionList");

  return useMutation({
    mutationFn: async (id: number) => {
      await restoreSession(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      toast({
        status: "default",
        description: t("restoreModal.successMessage"),
        icon: "flip-forward",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("restoreModal.errorMessage"),
      });
    },
  });
};
