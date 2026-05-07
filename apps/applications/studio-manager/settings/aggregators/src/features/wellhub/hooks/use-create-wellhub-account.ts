import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PartnershipAccount,
  createWellhubAccountAPI,
  partnershipKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const createAccount = createWellhubAccountAPI.bind(null, fetch);

type Variables = {
  externalId: string;
  establishmentIds: number[];
};

export const useCreateWellhubAccount = (partnershipId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  return useMutation<PartnershipAccount, Error, Variables>({
    mutationFn: ({ externalId, establishmentIds }) =>
      createAccount({
        partnership: partnershipId,
        external_id: externalId,
        establishment_group: establishmentIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnershipKeys.accounts(partnershipId),
      });
      toast({
        status: "default",
        icon: "check-circle",
        description: t("wellhub.toast.create.success"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("wellhub.toast.create.error"),
      });
    },
  });
};
