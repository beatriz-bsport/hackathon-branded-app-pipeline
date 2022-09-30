import { FranchiseProductTemplateQueryParams } from '#libs/franchise/types';
import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  putAuth,
  deleteAuth,
  buildUrlParams,
  post,
} from '../../http';

const COUPON_URI = `${API_V1_URI}/coupon/`;

export const fetchCouponPage = async (page: number) => {
  return getAuth(`${COUPON_URI}?page=${page}`);
};

export const fetchCoupons = async (data: any) => {
  return getAuth(`${COUPON_URI}${buildUrlParams(data)}`);
};

export const fetchCouponDiscounts = async (couponId: number, params: any) => {
  return getAuth(
    `${COUPON_URI}${couponId}/discount/${buildUrlParams({
      coupon: couponId,
      ...(params || {}),
    })}`,
  );
};

export const fetchDiscountList = async (params: any = {}) => {
  return getAuth(`${COUPON_URI}discount/${buildUrlParams(params)}`);
};

export const createCoupon = async (data: any) => {
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

export const updateCoupon = (id: string, data: any) => {
  return patchAuth(`${COUPON_URI}${id}/`, data);
};

export const deleteCoupon = (id: string) => {
  return deleteAuth(`${COUPON_URI}${id}/`);
};

export const untagCoupon = (id: number, tag: number) => {
  return postAuth(`${COUPON_URI}${id}/untag/`, { tag });
};

export const appliesToInvoice = async (
  coupon_code: string,
  memberId: number,
  invoice: any,
) => {
  return post(`${COUPON_URI}applies_to_invoice/`, {
    coupon_code,
    memberId,
    invoice,
  });
};

export async function fetchCouponTemplateList(
  params?: FranchiseProductTemplateQueryParams,
) {
  return getAuth(
    `${API_V1_URI}/coupon/coupon_template/${buildUrlParams(params)}`,
  );
}

export async function retrieveCouponTemplate(id: number) {
  return getAuth(`${API_V1_URI}/coupon/coupon_template/${id}/`);
}

export async function createOrUpdateCouponTemplate(data: any) {
  if (!data.id) {
    return postAuth(`${API_V1_URI}/coupon/coupon_template/`, data);
  }
  return putAuth(`${API_V1_URI}/coupon/coupon_template/${data.id}/`, data);
}

export async function deleteCouponTemplate(id: number) {
  return deleteAuth(`${API_V1_URI}/coupon/coupon_template/${id}/`);
}

export async function createCouponTemplateInstance(data: any) {
  return postAuth(
    `${API_V1_URI}/coupon/coupon_template_instance/multi_create/`,
    data,
  );
}

export async function deleteCouponTemplateInstance(id: number) {
  return deleteAuth(`${API_V1_URI}/coupon/coupon_template_instance/${id}/`);
}
