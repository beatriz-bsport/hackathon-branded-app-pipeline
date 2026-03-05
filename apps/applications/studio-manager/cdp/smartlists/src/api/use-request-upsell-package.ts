import { useMutation } from "@tanstack/react-query";

import { requestUpsellPackage } from "./api";

export type RequestUpsellPackageFn = (
  upsellIdentifier: number,
) => Promise<void>;

type UseRequestUpsellPackageOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  /**
   * Optional override for the API call. Use in tests or Storybook to mock success/error/delay.
   * @example
   * // Always succeed
   * requestUpsellPackageFn={async () => {}}
   * // Simulate error
   * requestUpsellPackageFn={async () => { throw new Error('Request failed'); }}
   * // Simulate delay (loading state)
   * requestUpsellPackageFn={async () => { await new Promise(r => setTimeout(r, 2000)); }}
   */
  requestUpsellPackageFn?: RequestUpsellPackageFn;
};

/**
 * Hook to request an upsell package by identifier (creates HubSpot deal).
 * Call mutate(upsellIdentifier) when the user confirms interest (e.g. "Get in touch").
 */
export function useRequestUpsellPackage({
  onSuccess,
  onError,
  requestUpsellPackageFn,
}: UseRequestUpsellPackageOptions = {}) {
  const mutationFn = requestUpsellPackageFn ?? requestUpsellPackage;

  return useMutation({
    mutationFn: (upsellIdentifier: number) => mutationFn(upsellIdentifier),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
