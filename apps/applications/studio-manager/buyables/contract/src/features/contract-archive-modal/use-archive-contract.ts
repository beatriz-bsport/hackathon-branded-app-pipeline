import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type Contract,
  archiveContractMutationOptions,
  queryKeys,
  restoreContractMutationOptions,
} from "@bsport/api-buyables/contract";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export type UseArchiveContractParams = {
  onSuccess?: (contract: Contract) => void;
  onError?: (contractId: number) => void;
};

export const useArchiveContract = ({
  onSuccess,
  onError,
}: UseArchiveContractParams) => {
  const { t } = useTranslation("contract-features");
  const queryClient = useQueryClient();

  // ----- Restore on undo -----

  const { mutate: restoreContract, isPending: isRestoring } = useMutation({
    ...restoreContractMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
      });

      toast({
        status: "default",
        icon: "reverse-left",
        title: t("archiveModal.toasts.undoSuccess"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("archiveModal.toasts.undoError"),
        buttonIcon: "x-close",
      });
    },
  });

  // ----- Archive -----

  const { mutate: archiveContract, isPending: isArchiving } = useMutation({
    ...archiveContractMutationOptions(fetch),
    onSuccess: (contract, params) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists(),
      });

      toast({
        status: "default",
        icon: "archive",
        title: t("archiveModal.toasts.success"),
        buttonLabel: t("archiveModal.toasts.undoAction"),
        onButtonClick: () => restoreContract(params),
      });

      onSuccess?.(contract);
    },
    onError: (_, params) => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("archiveModal.toasts.error"),
        buttonIcon: "x-close",
      });

      onError?.(params.id);
    },
  });

  return {
    archiveContract,
    isLoading: isArchiving || isRestoring,
  };
};
