import { useMutation } from "@tanstack/react-query";

import {
  type Contract,
  type UpdateContractParams,
  updateContractAPI,
} from "@bsport/api-buyables/contract";
import { HTTPException } from "@bsport/fetch";

import { fetch } from "#src/utils/fetch";

type Callbacks = {
  onSuccess?: (data: Contract) => void;
  onError?: (error: HTTPException | Error) => void;
};

export const useUpdateRevampedContract = ({
  onSuccess,
  onError,
}: Callbacks) => {
  return useMutation({
    mutationFn: (apiParams: UpdateContractParams) =>
      updateContractAPI(fetch, apiParams),
    onSuccess: (data) => onSuccess?.(data),
    onError: (error) => onError?.(error),
  });
};
