import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRoomBlueprintMutationOptions,
  spotSchedulingKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useCreateRoomBlueprint = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("venues-list");

  return useMutation({
    ...createRoomBlueprintMutationOptions(fetch),
    onSuccess: (blueprint) => {
      queryClient.invalidateQueries({
        queryKey: spotSchedulingKeys.roomBluePrintScope(),
      });
      window.location.assign(LEGACY_URLS.SPOT_SCHEDULING(blueprint.id));
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("detail.spotScheduling.toasts.createError"),
      });
    },
  });
};
