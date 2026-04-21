import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  collectionKeys,
  createCollectionAPI,
} from "@bsport/api-buyables/collection";
import { toast } from "@bsport/kaizen-primitive-core";

import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useCreateCollection = () => {
  const { t } = useTranslation("collection-form");
  const queryClient = useQueryClient();

  const { mutate: createCollection, isPending: isLoading } = useMutation({
    mutationFn: (formData: FormData) => createCollectionAPI(xhr, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      toast({
        status: "default",
        icon: "check",
        title: t("createModal.submitResponse.success"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("createModal.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return { createCollection, isLoading };
};
