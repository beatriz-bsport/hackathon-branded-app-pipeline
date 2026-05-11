import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateTagRuleParams,
  type TagRule,
  createTagRuleAPI,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

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
    mutationFn: (params: CreateTagRuleParams) =>
      createTagRuleAPI(fetch, params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.tagRules(
          String(data.smartlist),
        ),
      });
      queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.detail(
          String(data.smartlist),
        ),
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
