import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateTagRuleParams,
  type TagRule,
  createTagRule,
} from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

import { smartlistKeys } from "./api";

type UseCreateTagRuleParams = {
  onSuccess?: (data: TagRule) => void;
  onError?: (error: Error) => void;
};

export const useCreateTagRule = ({
  onSuccess,
  onError,
}: UseCreateTagRuleParams = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: CreateTagRuleParams) => createTagRule(fetch, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.tagRules(String(data.smartlist)),
      });
      queryClient.invalidateQueries({
        queryKey: smartlistKeys.detail(String(data.smartlist)),
      });
      onSuccess?.(data);
    },
    onError,
  });

  return {
    createTagRule: mutation.mutateAsync,
    isCreating: mutation.isPending,
  } as const;
};
