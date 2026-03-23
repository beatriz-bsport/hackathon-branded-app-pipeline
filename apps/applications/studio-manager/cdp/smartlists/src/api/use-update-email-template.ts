import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EditEmailTemplatePayload } from "@bsport/api-cdp";

import { smartlistKeys, updateEmailTemplate } from "./api";
import type { EmailTemplateDetail } from "./types";

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
      updateEmailTemplate(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.emailTemplate(),
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
