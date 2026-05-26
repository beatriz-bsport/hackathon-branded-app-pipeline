import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteEstablishmentMutationOptions,
  establishmentKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useArchiveVenue = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("venues-list");

  return useMutation({
    ...deleteEstablishmentMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: establishmentKeys.lists() });
      toast({
        status: "default",
        icon: "archive",
        description: t("toasts.archive"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({ status: "critical", description: t("toasts.archiveError") });
    },
  });
};
