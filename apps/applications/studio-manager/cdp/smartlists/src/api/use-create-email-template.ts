import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createEmailTemplate } from "@bsport/api-cdp";
import type {
  CreateEmailTemplatePayload,
  EmailTemplateDetail,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

import { smartlistKeys } from "./api";

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
      createEmailTemplate(fetch, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.emailTemplate(),
      });
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.emailTemplateCategories(),
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
