import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createContractPauseMutationOptions,
  queryKeys,
} from "@bsport/api-buyables/contract-pause";
import { registerBackgroundTask } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useCreateContractPause = ({
  contractName,
  onSuccess,
  onError,
}: {
  contractName: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const { t } = useTranslation("contract-features");
  const queryClient = useQueryClient();

  const { mutate: createPause, isPending } = useMutation({
    ...createContractPauseMutationOptions(fetch),
    onSuccess: ({ data, backgroundTaskUuid }) => {
      if (backgroundTaskUuid) {
        registerBackgroundTask({
          fetch: fetch,
          uuid: backgroundTaskUuid,
          successToast: {
            title: t("pauseModal.toastSuccess.create", { contractName }),
          },
          errorToast: {
            title: t("pauseModal.toastError.create", { contractName }),
          },
          onSuccess: () => {
            // Invalidate query
            queryClient.invalidateQueries({
              queryKey: queryKeys.listsByContract(data.contract),
            });
          },
        });
      }
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      onError?.(error);
    },
  });

  return { createPause, isGettingBackgroundTaskId: isPending };
};
