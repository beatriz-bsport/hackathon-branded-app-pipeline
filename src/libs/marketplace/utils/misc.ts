import { SEPA_REQUIRED_BILLING_ADDRESS_COUNTRIES } from '#libs/marketplace/constants';

export function httpParser(url: string) {
  const regex = /^https?:\/\//;
  return regex.test(url) ? url : `http://${url}`;
}

// pass page - parse the categories from router params to array of numbers if any
export const getParsedPassRestrictedCategories = (
  paymentPackCategoriesRouterParam: number[] | string,
  privatePassCategoriesRouterParam: number[] | string,
) => {
  let paymentPackCategories = null;
  let privatePassCategories = null;

  if (paymentPackCategoriesRouterParam) {
    paymentPackCategories =
      typeof paymentPackCategoriesRouterParam === 'string'
        ? paymentPackCategoriesRouterParam
            .split(',')
            .map((id: string) => parseInt(id, 10))
        : paymentPackCategoriesRouterParam;
  }

  if (privatePassCategoriesRouterParam) {
    privatePassCategories =
      typeof privatePassCategoriesRouterParam === 'string'
        ? privatePassCategoriesRouterParam
            .split(',')
            .map((id: string) => parseInt(id, 10))
        : privatePassCategoriesRouterParam;
  }

  return { paymentPackCategories, privatePassCategories };
};

export const getSepaDebitNeedsBillingAddress = (country: string) => {
  return country && SEPA_REQUIRED_BILLING_ADDRESS_COUNTRIES.includes(country);
};
