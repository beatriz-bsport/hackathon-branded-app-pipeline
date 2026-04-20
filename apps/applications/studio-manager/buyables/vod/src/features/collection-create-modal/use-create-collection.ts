import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import {
  collectionKeys,
  createCollectionAPI,
} from "@bsport/api-buyables/collection";
import { toast } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useCreateCollection = () => {
  const { t } = useTranslation("collection-form");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createCollection, isPending: isLoading } = useMutation({
    mutationFn: (formData: FormData) => createCollectionAPI(xhr, formData),
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      toast({
        status: "default",
        icon: "check",
        title: t("createModal.submitResponse.success"),
        buttonLabel: t("createModal.submitResponse.open"),
        onButtonClick: () => {
          navigate(URLS.COLLECTION_DETAILS(collection.id));
        },
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
