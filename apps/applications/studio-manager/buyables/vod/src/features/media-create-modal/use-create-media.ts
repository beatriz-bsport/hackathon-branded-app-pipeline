import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { createVideoAPI, videoKeys } from "@bsport/api-buyables/video";
import { toast } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export const useCreateMedia = () => {
  const { t } = useTranslation("media-form");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createMedia, isPending: isLoading } = useMutation({
    mutationFn: (formData: FormData) => createVideoAPI(xhr, formData),
    onSuccess: (media) => {
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      toast({
        status: "default",
        icon: "check",
        title: t("createModal.submitResponse.success"),
        buttonLabel: t("createModal.submitResponse.open"),
        onButtonClick: () => {
          navigate(URLS.MEDIA_DETAILS(media.id));
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

  return { createMedia, isLoading };
};
