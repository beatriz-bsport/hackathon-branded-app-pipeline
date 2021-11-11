// @flow

import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import type { Coupon, Discount } from './types';
import { isCurrentlyActive } from './utils';
import { getallTagsWithTagGroup } from '../tag/selectors';
import { RootState } from '../../reducers';

export const getAllCoupons = (state: RootState) => state.coupon.coupon.items;
export const getAllDiscounts = (state: RootState) =>
  state.coupon.discount.items;

export const getAvailableCoupons: (state: RootState) => Array<Coupon> =
  createSelector(getAllCoupons, (coupons) =>
    coupons.filter((coupon) => coupon.available),
  );
export const getCouponById: (state: RootState, number: number) => Coupon = (
  state,
  id,
) => getAllCoupons(state).find((coupon) => coupon.id === id);

export const withTags = memoize((selector: typeof getCouponById) =>
  createSelector([selector, getallTagsWithTagGroup], (coupon, tagList) => ({
    ...coupon,
    blacklist_tags: coupon?.blacklist_tags
      ?.map((id) => tagList.find((tag) => tag.id === id))
      .filter((tag) => tag),
    whitelist_tags: coupon?.whitelist_tags
      .map((id) => tagList.find((tag) => tag.id === id))
      .filter((tag) => tag),
  })),
);

export const getCouponDiscounts: (
  state: RootState,
  number: number,
) => Array<Discount> = (state, id) =>
  getAllDiscounts(state).filter((discount) => discount.coupon === id);

export const getActiveCoupons: (state: RootState) => Array<Coupon> =
  createSelector(getAvailableCoupons, (coupons) =>
    coupons.filter((coupon) => isCurrentlyActive(coupon)),
  );

export const getInactiveCoupons: (State) => Array<Coupon> = createSelector(
  getAvailableCoupons,
  (coupons) => coupons.filter((coupon) => !isCurrentlyActive(coupon)),
);
