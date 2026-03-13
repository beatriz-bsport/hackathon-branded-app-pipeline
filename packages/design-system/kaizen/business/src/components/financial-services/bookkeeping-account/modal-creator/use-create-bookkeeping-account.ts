import { useMutation } from "@tanstack/react-query";

import {
  type BookkeepingAccount,
  type CreateBookkeepingAccountParams,
  createBookkeepingAccountAPI,
} from "@bsport/api-financial-services";
import type { Fetch, HTTPException } from "@bsport/fetch";

export type UseCreateBookkeepingAccountParams = {
  fetch: Fetch;
  onSuccess?: ({
    data,
    variables,
  }: {
    data: BookkeepingAccount;
    variables: CreateBookkeepingAccountParams;
  }) => void;
  onError?: ({
    error,
    variables,
  }: {
    error: HTTPException | Error;
    variables: CreateBookkeepingAccountParams;
  }) => void;
};

export const useCreateBookkeepingAccount = ({
  fetch,
  onSuccess,
  onError,
}: UseCreateBookkeepingAccountParams) => {
  return useMutation({
    mutationFn: (apiParams: CreateBookkeepingAccountParams) =>
      createBookkeepingAccountAPI(fetch, apiParams),
    onSuccess: (data, variables) => {
      onSuccess?.({ data, variables });
    },
    onError: (error, variables) => {
      onError?.({ error, variables });
    },
  });
};
