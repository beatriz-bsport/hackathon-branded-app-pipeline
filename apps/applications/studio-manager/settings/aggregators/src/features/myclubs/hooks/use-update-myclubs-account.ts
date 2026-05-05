import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type PartnershipAccount,
  partnershipKeys,
  updatePartnershipAccountAPI,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const updateAccount = updatePartnershipAccountAPI.bind(null, fetch);

type Variables = {
  accountId: string;
  establishmentIds: number[];
};

export const useUpdateMyclubsAccount = (partnershipId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  return useMutation<PartnershipAccount, Error, Variables>({
    mutationFn: ({ accountId, establishmentIds }) =>
      updateAccount({
        id: accountId,
        partnership: partnershipId,
        establishment_group: establishmentIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnershipKeys.accounts(partnershipId),
      });
      toast({
        status: "default",
        description: t("myclubs.toast.update.success"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("myclubs.toast.update.error"),
      });
    },
  });
};
