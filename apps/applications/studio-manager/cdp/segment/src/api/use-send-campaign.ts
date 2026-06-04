import { useMutation } from "@tanstack/react-query";

import {
  type CampaignSent,
  type SendCampaignPayload,
  sendEmailCampaignAPI,
} from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

type UseSendCampaignParams = {
  onSuccess?: (data: CampaignSent) => void;
  onError?: (error: Error) => void;
};

export const useSendCampaign = ({
  onSuccess,
  onError,
}: UseSendCampaignParams = {}) => {
  const mutation = useMutation({
    mutationFn: ({ payload }: { payload: SendCampaignPayload }) =>
      sendEmailCampaignAPI(fetch, payload),
    onSuccess,
    onError,
  });

  return {
    sendCampaign: mutation.mutateAsync,
    isSending: mutation.isPending,
  } as const;
};
