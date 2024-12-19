import URI from 'urijs';
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

/**
 * Extension of URI to safely add queryParams to avoid empty value in queryparams
 */
export class SafeURI extends URI {
  addQuery = (queryName: string, queryValue?: string | number): SafeURI => {
    if (!!queryValue && !!queryValue){
      super.addQuery(queryName, queryValue);
    }      
    return this;
  };

  safeAddQuery = (
    queryName: string|Record<string, string | number>,
    queryValue?:  string | number,
  ) => {
    if (
      ['string', 'number'].includes(typeof queryName) ) {
      return this.addQuery(queryName as string, queryValue as string|number);
    } else if (typeof queryName == 'object') {
      for (var key in queryName) {
        if (['string', 'number'].includes(typeof key) ) {
          this.addQuery(key, queryName[key]);
        }
      }
    }
    return this;
  };
}
