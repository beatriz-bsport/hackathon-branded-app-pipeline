import { getEnv } from '../utils/env';
import { buildUrlParams } from '../utils/http';

export const buildFranchiseSelectionThenCheckoutUrl = (
  franchiseId: number,
  paymentPackTemplateId: number,
  companies: Array<number>,
) => {
  if (!franchiseId || !paymentPackTemplateId) {
    return null;
  }
  const { PUBLIC_URL } = getEnv();
  const signUpNext = encodeURIComponent(
    `pre-checkout/payment-pack-template/${paymentPackTemplateId}`,
  );
  const next = encodeURIComponent(
    `/c/franchisee-selector/${franchiseId}?paymentPackTemplateCompanies=${companies.join()}&context=widget&next=${encodeURIComponent(
      `pre-checkout/payment-pack-template/${paymentPackTemplateId}?context=widget&onValidation=close`,
    )}`,
  );
  const franchisor = encodeURIComponent(`${franchiseId}`);
  return `${PUBLIC_URL}/login?${buildUrlParams({
    next,
    paymentPackTemplateCompanies: companies,
    signUpNext,
    franchisor,
  })}`;
};
