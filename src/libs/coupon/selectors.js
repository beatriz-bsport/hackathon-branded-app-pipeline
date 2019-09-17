// @flow

import { createSelector } from 'reselect';
import type { Coupon, Discount } from './types';
import type { State } from '../../state/types';
import { isCurrentlyActive } from './utils';

export const getAllCoupons = (state: State) => state.coupon.coupon.items;
export const getAllDiscounts = (state: State) => state.coupon.discount.items;

export const getAvailableCoupons: (State) => Array<Coupon> = createSelector(
  getAllCoupons,
  (coupons) => coupons.filter((coupon) => coupon.available),
);
export const getCouponById: (State, number) => ?Coupon = (state, id) =>
  getAllCoupons(state).find((coupon) => coupon.id === id);

export const getCouponDiscounts: (State, number) => Array<Discount> = (
  state,
  id,
) => getAllDiscounts(state).filter((discount) => discount.coupon === id);

export const getActiveCoupons: (State) => Array<Coupon> = createSelector(
  getAvailableCoupons,
  (coupons) => coupons.filter((coupon) => isCurrentlyActive(coupon)),
);

export const getInactiveCoupons: (State) => Array<Coupon> = createSelector(
  getAvailableCoupons,
  (coupons) => coupons.filter((coupon) => !isCurrentlyActive(coupon)),
);
