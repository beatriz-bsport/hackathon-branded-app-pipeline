import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type TagRule,
  type UpdateTagRuleParams,
  updateTagRuleAPI,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

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
    mutationFn: (params: UpdateTagRuleParams) =>
      updateTagRuleAPI(fetch, params),
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
    updateTagRule: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  } as const;
};
