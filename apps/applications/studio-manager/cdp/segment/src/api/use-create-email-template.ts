import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateEmailTemplatePayload,
  type EmailTemplateDetail,
  createEmailTemplateAPI,
} from "@bsport/api-cdp/email-template";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseCreateEmailTemplateParams = {
  onSuccess?: (data: EmailTemplateDetail) => void;
  onError?: (error: Error) => void;
};

export function useCreateEmailTemplate({
  onSuccess,
  onError,
}: UseCreateEmailTemplateParams = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateEmailTemplatePayload) =>
      createEmailTemplateAPI(fetch, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.emailTemplateKeys.emailTemplate(),
      });
      queryClient.invalidateQueries({
        queryKey:
          smartlistQueryKeys.emailTemplateKeys.emailTemplateCategories(),
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    createTemplate: mutation.mutateAsync,
    isCreating: mutation.isPending,
  } as const;
}
