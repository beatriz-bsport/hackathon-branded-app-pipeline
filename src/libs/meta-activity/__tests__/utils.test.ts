import { MarketPlaceFilter } from '#libs/marketplace/types';
import { convertMarketplaceFilterForMetaActivityCall } from '../utils';
// @ts-expect-error
import { MetaActivityFilter } from './types';

const defaultFilter: MetaActivityFilter = {
  company: 1,
  with_future_slots: true,
};

const completeFilterMarketplace: MarketPlaceFilter = {
  activity__in: [1, 42],
  coaches: [2, 43],
  establishments: [3, 44],
  levels: [4, 45],
  establishment_group__in: [5, 46],
};

const completeFilter: MetaActivityFilter = {
  company: 1,
  with_future_slots: true,
  id__in: [1, 42],
  coach__in: [2, 43],
  establishment__in: [3, 44],
  level__in: [4, 45],
  establishment_group__in: [5, 46],
};

describe('Utils: convert marketplace filter into metaActivity filter', () => {
  it('Check for the empty filter', () => {
    // @ts-expect-error
    expect(convertMarketplaceFilterForMetaActivityCall(1, {})).toStrictEqual(
      defaultFilter,
    );
  });
  it('Check for the complete filter', () => {
    expect(
      convertMarketplaceFilterForMetaActivityCall(1, completeFilterMarketplace),
    ).toStrictEqual(completeFilter);
  });
});
