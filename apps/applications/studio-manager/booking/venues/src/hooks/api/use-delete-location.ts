import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteEstablishmentGroupMutationOptions,
  establishmentGroupKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("venues-list");

  return useMutation({
    ...deleteEstablishmentGroupMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: establishmentGroupKeys.lists(),
      });
      toast({
        status: "default",
        icon: "trash-01",
        description: t("toasts.locationDelete"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("toasts.locationDeleteError"),
      });
    },
  });
};
