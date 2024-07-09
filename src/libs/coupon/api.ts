import { AxiosResponse } from 'axios';
import { FranchiseProductTemplateQueryParams } from '#src/libs/franchise/types';
import { PaginatedResponse } from '../../state/types';
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
import type {
  ApplyToContractAPI,
  Coupon,
  FetchCouponsParams,
  CouponTemplate,
  CouponTemplateInstance,
  Discount,
  AppliesToInvoiceBody,
  AppliesToInvoiceResponse,
  FetchDiscountParams,
  UniqueCodeCouponCreationPayload,
  CheckCouponCodePayload,
  CheckCouponCodeResponsePayload,
  CouponTemplateParams,
} from './types';

const COUPON_URI = `${API_V1_URI}/coupon/`;

export const fetchCouponPage: (
  page: number,
) => Promise<AxiosResponse<Coupon[]>> = async (page) => {
  return getAuth(`${COUPON_URI}?page=${page}`);
};

export const fetchCoupons: (
  data: FetchCouponsParams,
) => Promise<AxiosResponse<Coupon[]>> = async (data) => {
  return getAuth(`${COUPON_URI}${buildUrlParams(data)}`);
};

export const fetchCouponDiscounts: (
  couponId: number,
  params: FetchDiscountParams,
) => Promise<AxiosResponse<PaginatedResponse<Discount> | Discount[]>> = async (
  couponId,
  params,
) => {
  return getAuth(
    `${COUPON_URI}${couponId}/discount/${buildUrlParams({
      coupon: couponId,
      ...(params || {}),
    })}`,
  );
};

export const checkCouponCodeValidity = async (
  payload: CheckCouponCodePayload,
) => {
  return postAuth<CheckCouponCodeResponsePayload>(
    `${COUPON_URI}coupon_code_used/`,
    payload,
  );
};

export const fetchDiscountList: (
  params: FetchDiscountParams,
) => Promise<
  AxiosResponse<(PaginatedResponse<Discount> | Discount[]) & { page?: number }>
> = async (params = {}) => {
  return getAuth(`${COUPON_URI}discount/${buildUrlParams(params)}`);
};

export const createCoupon: (
  data: Coupon,
) => Promise<AxiosResponse<Coupon>> = async (data) => {
  return postAuth(COUPON_URI, data);
};

export const appliesToContract: (data: {
  coupon_code: string;
  contract: number;
  member?: number;
  with_prorata?: boolean;
  from_timestamp?: number;
}) => Promise<AxiosResponse<ApplyToContractAPI>> = async (data) => {
  if (data?.member !== undefined) {
    return post(`${COUPON_URI}applies_to_contract/`, data);
  }

  return postAuth(`${COUPON_URI}applies_to_contract/`, {
    coupon_code: data.coupon_code,
    contract: data.contract,
    with_prorata: data.with_prorata,
    from_timestamp: data.from_timestamp,
  });
};

export const updateCoupon: (
  id: string | number,
  data: Coupon,
) => Promise<AxiosResponse<Coupon>> = (id, data) => {
  return patchAuth(`${COUPON_URI}${id}/`, data);
};

export const deleteCoupon: (id: string) => Promise<AxiosResponse<null>> = (
  id,
) => {
  return deleteAuth(`${COUPON_URI}${id}/`);
};

export const untagCoupon: (
  id: number,
  tag: number,
) => Promise<AxiosResponse<Coupon>> = (id, tag) => {
  return postAuth(`${COUPON_URI}${id}/untag/`, { tag });
};

export const appliesToInvoice = (payload: AppliesToInvoiceBody) =>
  postAuth<AppliesToInvoiceResponse>(
    `${COUPON_URI}applies_to_invoice_new/`,
    payload,
  );

export const fetchCouponTemplateList: (
  params?: FranchiseProductTemplateQueryParams,
) => Promise<AxiosResponse<PaginatedResponse<CouponTemplate>>> = (params) => {
  return getAuth(
    `${API_V1_URI}/coupon/coupon_template/${buildUrlParams(params)}`,
  );
};

export const retrieveCouponTemplate: (
  id: number,
) => Promise<AxiosResponse<CouponTemplate>> = async (id) => {
  return getAuth(`${API_V1_URI}/coupon/coupon_template/${id}/`);
};

export const createOrUpdateCouponTemplate: (
  data: CouponTemplate,
) => Promise<AxiosResponse<CouponTemplate>> = async (data) => {
  if (!data.id) {
    return postAuth(`${API_V1_URI}/coupon/coupon_template/`, data);
  }
  return putAuth(`${API_V1_URI}/coupon/coupon_template/${data.id}/`, data);
};

export const deleteCouponTemplate: (
  id: number,
) => Promise<AxiosResponse<null>> = async (id) => {
  return deleteAuth(`${API_V1_URI}/coupon/coupon_template/${id}/`);
};

export const createCouponTemplateInstance: (
  data: CouponTemplateParams,
) => Promise<AxiosResponse<CouponTemplateInstance>> = async (data) => {
  return postAuth(
    `${API_V1_URI}/coupon/coupon_template_instance/multi_create/`,
    data,
  );
};

export const deleteCouponTemplateInstance: (
  id: number,
) => Promise<AxiosResponse<null>> = async (id) => {
  return deleteAuth(`${API_V1_URI}/coupon/coupon_template_instance/${id}/`);
};

export const createUniqueCodeCoupon: (
  data: UniqueCodeCouponCreationPayload,
) => Promise<AxiosResponse<Coupon>> = (data) => {
  return postAuth(`${COUPON_URI}unique_code/`, data);
};

export const updateUniqueCodeCoupon = (
  id: number,
  data: UniqueCodeCouponCreationPayload,
) => {
  return putAuth<Coupon>(`${COUPON_URI}unique_code/${id}/`, data);
};

export const retrieveCoupon = (id: string | number) => {
  return getAuth<Coupon>(`${COUPON_URI}${id}/`);
};

export const markCodesAsRedeemed = (
  id: string | number,
  data: { codes: string[] },
) => {
  return putAuth<Coupon>(`${COUPON_URI}unique_code/${id}/redeem/`, data);
};

export const exportCodesAsCsv = (
  id: string | number,
  data: { codes: string[] },
) => {
  return postAuth<string>(`${COUPON_URI}unique_code/${id}/export/`, data);
};
