import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CampaignSent,
  type SendCampaignPayload,
  sendEmailCampaignAPI,
} from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

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
      sendEmailCampaignAPI(fetch, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.detail(String(data.metadata.smartlist_id)),
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
