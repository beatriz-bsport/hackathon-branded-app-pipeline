import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  collectionKeys,
  updateCollectionAPI,
} from "@bsport/api-buyables/collection";
import { toast } from "@bsport/kaizen-primitive-core";

import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useEditCollection = () => {
  const { t } = useTranslation("collection-form");
  const queryClient = useQueryClient();

  const { mutate: editCollection, isPending: isLoading } = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateCollectionAPI(xhr, { id, data: formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      toast({
        status: "positive",
        icon: "save",
        title: t("editModal.submitResponse.success"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("editModal.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return { editCollection, isLoading };
};
