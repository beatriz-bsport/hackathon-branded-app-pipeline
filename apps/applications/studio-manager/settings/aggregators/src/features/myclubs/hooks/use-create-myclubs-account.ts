import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PartnershipAccount,
  createPartnershipAccountAPI,
  partnershipKeys,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const createAccount = createPartnershipAccountAPI.bind(null, fetch);

type Variables = {
  establishmentIds: number[];
};

export const useCreateMyclubsAccount = (partnershipId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  return useMutation<PartnershipAccount, Error, Variables>({
    mutationFn: ({ establishmentIds }) =>
      createAccount({
        partnership: partnershipId,
        establishment_group: establishmentIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnershipKeys.accounts(partnershipId),
      });
      toast({
        status: "default",
        description: t("myclubs.toast.create.success"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("myclubs.toast.create.error"),
      });
    },
  });
};
