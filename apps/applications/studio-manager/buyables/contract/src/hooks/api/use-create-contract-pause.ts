import { useMutation } from "@tanstack/react-query";

import { createContractPauseMutationOptions } from "@bsport/api-buyables/contract-pause";
import { registerBackgroundTask } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useCreateContractPause = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation("contract-features");

  const { mutate: createPause, isPending } = useMutation({
    ...createContractPauseMutationOptions(fetch),
    onSuccess: ({ data, backgroundTaskUuid }) => {
      if (backgroundTaskUuid) {
        registerBackgroundTask({
          fetch: fetch,
          uuid: backgroundTaskUuid,
          successToast: {
            title: t("pauseModal.toastSuccess", { name: data.name }),
          },
        });
      }
      onSuccess?.();
    },
  });

  return { createPause, isGettingBackgroundTaskId: isPending };
};
