import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePartnershipAccountAPI, partnershipKeys } from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { type TFunction, useTranslation } from "#src/utils/i18n";

import type { FullyMutableNamespace } from "../types";

const deleteAccount = deletePartnershipAccountAPI.bind(null, fetch);

const TOAST_KEYS = {
  myclubs: {
    success: "myclubs.toast.delete.success",
    error: "myclubs.toast.delete.error",
  },
  wellhub: {
    success: "wellhub.toast.delete.success",
    error: "wellhub.toast.delete.error",
  },
} as const satisfies Record<
  FullyMutableNamespace,
  Record<string, Parameters<TFunction>[0]>
>;

type Variables = { accountId: string };

export const useDeleteAccount = (
  partnershipId: number,
  namespace: FullyMutableNamespace,
) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");
  const keys = TOAST_KEYS[namespace];

  return useMutation<void, Error, Variables>({
    mutationFn: ({ accountId }) => deleteAccount({ id: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnershipKeys.accounts(partnershipId),
      });
      toast({
        status: "default",
        icon: "trash-01",
        description: t(keys.success),
      });
    },
    onError: () => {
      toast({ status: "critical", description: t(keys.error) });
    },
  });
};
