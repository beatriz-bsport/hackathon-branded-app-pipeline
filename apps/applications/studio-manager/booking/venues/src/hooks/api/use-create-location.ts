import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createEstablishmentGroupMutationOptions,
  establishmentGroupKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("location-form");

  return useMutation({
    ...createEstablishmentGroupMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: establishmentGroupKeys.lists(),
      });
      toast({
        status: "default",
        icon: "check",
        buttonIcon: "x-close",
        description: t("toasts.createSuccess"),
      });
    },
    onError: () => {
      toast({ status: "critical", description: t("toasts.createError") });
    },
  });
};
