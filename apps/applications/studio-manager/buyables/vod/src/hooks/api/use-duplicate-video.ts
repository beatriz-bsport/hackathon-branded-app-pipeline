import { useMutation, useQueryClient } from "@tanstack/react-query";

import { duplicateVideoAPI, videoKeys } from "@bsport/api-buyables/video";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useDuplicateVideo = () => {
  const { t } = useTranslation("media-list");
  const queryClient = useQueryClient();

  const { mutate: duplicateVideo, isPending: isLoading } = useMutation({
    mutationFn: (id: number) => duplicateVideoAPI(fetch, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      toast({
        status: "default",
        icon: "copy-03",
        title: t("duplicateResponse.success"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("duplicateResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return { duplicateVideo, isLoading };
};
