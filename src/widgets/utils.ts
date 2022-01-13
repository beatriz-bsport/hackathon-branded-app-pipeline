import { getEnv } from '../utils/env';

export const buildFranchiseSelectionThenCheckoutUrl = (
  franchiseId: number,
  paymentPackTemplateId: number,
) => {
  if (!franchiseId || !paymentPackTemplateId) {
    return null;
  }
  const { PUBLIC_URL } = getEnv();

  return `${PUBLIC_URL}/login?franchisor=${franchiseId}&next=/c/franchisee-selector/${franchiseId}?next=pre-checkout/payment-pack-template/${paymentPackTemplateId}`;
};
