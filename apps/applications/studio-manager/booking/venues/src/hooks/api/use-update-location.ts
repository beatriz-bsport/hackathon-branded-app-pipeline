import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  establishmentGroupKeys,
  updateEstablishmentGroupMutationOptions,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("location-form");

  return useMutation({
    ...updateEstablishmentGroupMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: establishmentGroupKeys.lists(),
      });
    },
    onError: () => {
      toast({ status: "critical", description: t("toasts.updateError") });
    },
  });
};
