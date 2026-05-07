import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePartnershipAccountAPI, partnershipKeys } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

const deleteAccount = deletePartnershipAccountAPI.bind(null, fetch);

type Variables = {
  accountId: string;
};

export const useDeleteWellhubAccount = (partnershipId: number) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");

  return useMutation<void, Error, Variables>({
    mutationFn: ({ accountId }) => deleteAccount({ id: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnershipKeys.accounts(partnershipId),
      });
      toast({
        status: "default",
        icon: "check-circle",
        description: t("wellhub.toast.delete.success"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        description: t("wellhub.toast.delete.error"),
      });
    },
  });
};
