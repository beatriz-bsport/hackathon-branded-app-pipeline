import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateVideoAPI, videoKeys } from "@bsport/api-buyables/video";
import { toast } from "@bsport/kaizen-primitive-core";

import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useEditMedia = () => {
  const { t } = useTranslation("media-form");
  const queryClient = useQueryClient();

  const { mutate: editMedia, isPending: isLoading } = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateVideoAPI(xhr, { id, data: formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
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

  return { editMedia, isLoading };
};
