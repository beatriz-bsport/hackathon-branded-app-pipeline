import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type UpdateCollectionVideoItemParams,
  addVideoToCollectionMutationOptions,
  collectionKeys,
} from "@bsport/api-buyables/collection";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type UseAddVideoToCollectionOptions = {
  onSuccess?: (videoId: number) => void;
};

export const useAddVideoToCollection = (
  options: UseAddVideoToCollectionOptions = {},
) => {
  const { onSuccess } = options;
  const { t } = useTranslation("collection-details");
  const queryClient = useQueryClient();

  const { mutate: addVideoToCollection, isPending: isLoading } = useMutation({
    ...addVideoToCollectionMutationOptions(fetch),
    onSuccess: (_, variables: UpdateCollectionVideoItemParams) => {
      queryClient.invalidateQueries({
        queryKey: collectionKeys.detail(variables.id),
      });
      toast({
        status: "default",
        icon: "check",
        title: t("addMediaModal.submitResponse.success"),
        buttonIcon: "x-close",
      });
      onSuccess?.(variables.video);
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("addMediaModal.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return { addVideoToCollection, isLoading };
};
