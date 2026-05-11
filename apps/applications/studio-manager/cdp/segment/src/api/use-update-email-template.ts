import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type EditEmailTemplatePayload,
  type EmailTemplateDetail,
  updateEmailTemplateAPI,
} from "@bsport/api-cdp/email-template";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpdateEmailTemplateParams = {
  onSuccess?: (data: EmailTemplateDetail) => void;
  onError?: (error: Error) => void;
};

export function useUpdateEmailTemplate({
  onSuccess,
  onError,
}: UseUpdateEmailTemplateParams = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: EditEmailTemplatePayload) =>
      updateEmailTemplateAPI(fetch, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.emailTemplateKeys.emailTemplate(),
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    updateEmailTemplate: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  } as const;
}
