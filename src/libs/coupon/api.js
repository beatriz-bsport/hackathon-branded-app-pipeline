// @flow
import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

const COUPON_URI = `${API_V1_URI}/coupon/`;

export const fetchCouponPage = async (page: number) => {
  return getAuth(`${COUPON_URI}?page=${page}`);
};

export const fetchCouponDiscounts = async (couponId: number, params: any) => {
  return getAuth(
    `${COUPON_URI}${couponId}/discount/${buildUrlParams({
      coupon: couponId,
      ...(params || {}),
    })}`,
  );
};

export const createCoupon = async (data: *) => {
  return postAuth(COUPON_URI, data);
};

export const updateCoupon = (id: string, data: *) => {
  return patchAuth(`${COUPON_URI}${id}/`, data);
};

export const deleteCoupon = (id: string) => {
  return deleteAuth(`${COUPON_URI}${id}/`);
};
