// @flow
//
import moment from 'moment-timezone';
import type { Coupon } from './types';

export const isCurrentlyActive = (coupon: Coupon) =>
  coupon.is_active &&
  (coupon.expiration_date
    ? moment(coupon.expiration_date).isSameOrAfter(moment(), 'day')
    : true);
