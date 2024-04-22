import { SearchObjectType } from '#libs/fuzzy-search/types';

const typeToURIMap: Record<SearchObjectType, string> = {
  coach_payment_rules: 'coach_payment_rules',
  coupon: 'coupon',
};

export const getSearchObjectURI = (objectType: SearchObjectType): string => {
  return typeToURIMap[objectType];
};
