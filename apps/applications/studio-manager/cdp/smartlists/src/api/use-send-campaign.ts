import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendEmailCampaign, smartlistKeys } from "./api";
import type { CampaignSent, SendCampaignPayload } from "./types";

type UseSendCampaignParams = {
  onSuccess?: (data: CampaignSent) => void;
  onError?: (error: Error) => void;
};

export const useSendCampaign = ({
  onSuccess,
  onError,
}: UseSendCampaignParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ payload }: { payload: SendCampaignPayload }) =>
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
