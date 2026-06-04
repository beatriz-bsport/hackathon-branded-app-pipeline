import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateEstablishmentPayload,
  createEstablishment,
  establishmentKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type CreateVenueArgs = {
  payload: CreateEstablishmentPayload;
};

export const useCreateVenue = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("venues-list");

  return useMutation({
    mutationFn: async ({ payload }: CreateVenueArgs) => {
      const venue = await createEstablishment(xhr, payload);
      return venue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: establishmentKeys.lists() });
      toast({
        status: "default",
        icon: "check-circle",
        description: t("toasts.create"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({ status: "critical", description: t("toasts.createError") });
    },
  });
};
