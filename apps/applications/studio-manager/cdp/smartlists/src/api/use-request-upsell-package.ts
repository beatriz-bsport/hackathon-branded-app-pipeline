import { useMutation } from "@tanstack/react-query";

import { requestUpsellPackageAPI } from "@bsport/api-financial-services";

import { fetch } from "#src/utils/fetch";

type UseRequestUpsellPackageOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Hook to request an upsell package by identifier (creates HubSpot deal).
 * Call mutate(upsellIdentifier) when the user confirms interest (e.g. "Get in touch").
 */
export function useRequestUpsellPackage({
  onSuccess,
  onError,
}: UseRequestUpsellPackageOptions = {}) {
  return useMutation({
    mutationFn: (upsellIdentifier: number) =>
      requestUpsellPackageAPI(fetch, upsellIdentifier),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
