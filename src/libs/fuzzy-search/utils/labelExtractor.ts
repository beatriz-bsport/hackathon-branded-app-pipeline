import type { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import type { Coupon } from '#libs/coupon/types';
import type {
  ObjectSearchResult,
  SearchObjectType,
} from '#libs/fuzzy-search/types';

const labelExtractorMap: Record<
  SearchObjectType,
  (item: ObjectSearchResult) => string
> = {
  coach_payment_rules: (coachPaymentRule: CoachPaymentRule) =>
    coachPaymentRule.name,
  coupon: (coupon: Coupon) => coupon.name,
};

export const getLabelFromItem = ({
  item,
  searchedObjectType,
}: {
  item: ObjectSearchResult;
  searchedObjectType: SearchObjectType;
}) => {
  return labelExtractorMap[searchedObjectType](item);
};
