import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type TagRule,
  type UpdateTagRuleParams,
  tagRuleKeys,
  updateTagRule,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

import { smartlistKeys } from "./api";

type UseUpdateTagRuleParams = {
  onSuccess?: (data: TagRule) => void;
  onError?: (error: Error) => void;
};

export const useUpdateTagRule = ({
  onSuccess,
  onError,
}: UseUpdateTagRuleParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: UpdateTagRuleParams) => updateTagRule(fetch, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.tagRules(String(data.smartlist)),
      });
      queryClient.invalidateQueries({
        queryKey: tagRuleKeys.detail(String(data.id)),
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    updateTagRule: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  } as const;
};
