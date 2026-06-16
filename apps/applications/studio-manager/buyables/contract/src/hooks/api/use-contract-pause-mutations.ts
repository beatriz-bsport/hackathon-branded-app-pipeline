import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteContractPauseMutationOptions,
  queryKeys,
  updateContractPauseMutationOptions,
  updateContractPauseNameOnlyMutationOptions,
} from "@bsport/api-buyables/contract-pause";
import { registerBackgroundTask } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useUpdateContractPauseMutation = ({
  onSuccess,
  onError,
  contractName,
}: {
  contractName: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const { t } = useTranslation("contract-features");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    ...updateContractPauseMutationOptions(fetch),
    onSuccess: ({ backgroundTaskUuid, data }) => {
      if (backgroundTaskUuid) {
        registerBackgroundTask({
          fetch: fetch,
          uuid: backgroundTaskUuid,
          successToast: {
            title: t("pauseModal.toastSuccess.edit", { contractName }),
          },
          errorToast: {
            title: t("pauseModal.toastError.edit", { pauseName: data.name }),
          },
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: queryKeys.listsByContract(data.contract),
            });
          },
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeys.listsByContract(data.contract),
        });
      }
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      onError?.(error);
    },
  });

  return { updatePause: mutate, isGettingBackgroundTaskId: isPending };
};

export const useUpdateContractPauseNameOnlyMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    ...updateContractPauseNameOnlyMutationOptions(fetch),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.listsByContract(data.contract),
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      onError?.(error);
    },
  });

  return { updatePauseName: mutate, isMutatingName: isPending };
};

export const useDeleteContractPauseMutation = ({
  onSuccess,
  onError,
  contractId,
}: {
  onError?: (error: unknown) => void;
  onSuccess?: () => void;
  contractId: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteContractPauseMutationOptions(fetch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.listsByContract(contractId),
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      onError?.(error);
    },
  });
};
