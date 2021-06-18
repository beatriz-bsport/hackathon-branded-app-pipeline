// @flow
import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
  post,
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

export const appliesToContract = async (
  coupon_code: string,
  contract: number,
  member?: number,
) => {
  if (member !== undefined) {
    return post(`${COUPON_URI}applies_to_contract/`, {
      coupon_code,
      contract,
      member,
    });
  }

  return postAuth(`${COUPON_URI}applies_to_contract/`, {
    coupon_code,
    contract,
  });
};

export const updateCoupon = (id: string, data: *) => {
  return patchAuth(`${COUPON_URI}${id}/`, data);
};

export const deleteCoupon = (id: string) => {
  return deleteAuth(`${COUPON_URI}${id}/`);
};
