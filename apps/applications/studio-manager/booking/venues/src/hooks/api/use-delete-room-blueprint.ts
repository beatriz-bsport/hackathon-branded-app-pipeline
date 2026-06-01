import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteRoomBlueprintMutationOptions,
  spotSchedulingKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useDeleteRoomBlueprint = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("venues-list");

  return useMutation({
    ...deleteRoomBlueprintMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: spotSchedulingKeys.roomBluePrintScope(),
      });
      toast({
        status: "default",
        icon: "trash-01",
        buttonIcon: "x",
        description: t("detail.spotScheduling.toasts.delete"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("detail.spotScheduling.toasts.deleteError"),
      });
    },
  });
};
