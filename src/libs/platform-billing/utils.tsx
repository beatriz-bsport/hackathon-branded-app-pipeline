// @ts-nocheck
import { FeatureList } from '#libs/company/types';

export const hasUpsell = (
  featureList: FeatureList,
  upsellIdentifier: number,
) => {
  return !!featureList?.upsell?.find(
    (f) => f.upsell_identifier === upsellIdentifier,
  );
};
