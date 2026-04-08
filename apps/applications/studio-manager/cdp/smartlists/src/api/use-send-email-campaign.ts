import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendEmailCampaign, smartlistKeys } from "./api";
import type { CampaignSent, SendEmailCampaignPayload } from "./types";

type UseSendEmailCampaignParams = {
  onSuccess?: (data: CampaignSent) => void;
  onError?: (error: Error) => void;
};

export const useSendEmailCampaign = ({
  onSuccess,
  onError,
}: UseSendEmailCampaignParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ payload }: { payload: SendEmailCampaignPayload }) =>
      sendEmailCampaign(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.detail(String(data.metadata.smartlist_id)),
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    sendCampaign: mutation.mutateAsync,
    isSending: mutation.isPending,
  } as const;
};
