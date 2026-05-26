import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  establishmentKeys,
  restoreEstablishmentMutationOptions,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useUnarchiveVenue = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("venues-list");

  return useMutation({
    ...restoreEstablishmentMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: establishmentKeys.lists() });
      toast({
        status: "default",
        icon: "flip-forward",
        description: t("toasts.unarchive"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({ status: "critical", description: t("toasts.unarchiveError") });
    },
  });
};
