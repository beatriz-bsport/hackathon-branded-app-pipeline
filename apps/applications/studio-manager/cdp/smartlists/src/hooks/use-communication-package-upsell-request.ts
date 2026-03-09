import {
  type RequestUpsellPackageFn,
  useRequestUpsellPackage,
} from "#src/api/use-request-upsell-package";
import type { UpsellCampaignTypeId } from "#src/components/CampaignTypeSelector/CommunicationPackageUpsellModal";
import { UPSELL_IDENTIFIER_BY_CAMPAIGN_TYPE } from "#src/hooks/use-upsell-checker";

type UseCommunicationPackageUpsellRequestOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  /**
   * Optional override for the API call. Use in tests or Storybook to mock success/error/delay.
   */
  requestUpsellPackageFn?: RequestUpsellPackageFn;
};

/**
 * Hook to request the communication package upsell (HubSpot deal) for a given campaign type.
 * Encapsulates the mutation and identifier lookup (sms/push/popup → upsell identifier).
 */
export function useCommunicationPackageUpsellRequest({
  onSuccess,
  onError,
  requestUpsellPackageFn,
}: UseCommunicationPackageUpsellRequestOptions = {}) {
  const { mutate: requestUpsellByIdentifier, isPending } =
    useRequestUpsellPackage({
      onSuccess,
      onError,
      requestUpsellPackageFn,
    });

  const requestUpsell = (campaignTypeId: UpsellCampaignTypeId) => {
    const identifier = UPSELL_IDENTIFIER_BY_CAMPAIGN_TYPE[campaignTypeId];
    requestUpsellByIdentifier(identifier);
  };

  return { requestUpsell, isPending };
}
