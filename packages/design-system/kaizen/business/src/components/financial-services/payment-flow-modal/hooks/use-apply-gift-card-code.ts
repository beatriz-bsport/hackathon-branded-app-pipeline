import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  applyGiftCardCodeAPI,
  giftcardKeys,
} from "@bsport/api-buyables/giftcard";
import { type Fetch, HTTPException } from "@bsport/fetch";

type UseApplyGiftCardCodeParams = {
  fetch: Fetch;
  memberId: number;
  onSuccess?: () => void;
  onError?: (errorType: "invalid" | "generic") => void;
};

/**
 * Mutation hook to apply a gift-card code to the current member.
 *
 * It normalizes backend errors into UI-oriented categories:
 * - `invalid`: code not found (404);
 * - `generic`: any other failure.
 */
export const useApplyGiftCardCode = ({
  fetch,
  memberId,
  onSuccess,
  onError,
}: UseApplyGiftCardCodeParams) => {
  const queryClient = useQueryClient();
  const applyGiftCardCodeRequest = applyGiftCardCodeAPI.bind(null, fetch);

  const { mutate: applyGiftCardCode, isPending: isApplyingGiftCardCode } =
    useMutation({
      mutationFn: (code: string) =>
        applyGiftCardCodeRequest({
          dst_member: memberId,
          code,
        }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: giftcardKeys.all,
        });
        onSuccess?.();
      },
      onError: (error) => {
        const isHttpError = error instanceof HTTPException;
        const isNotFound = isHttpError && error.statusCode === 404;

        onError?.(isNotFound ? "invalid" : "generic");
      },
    });

  return {
    applyGiftCardCode,
    isApplyingGiftCardCode,
  };
};
