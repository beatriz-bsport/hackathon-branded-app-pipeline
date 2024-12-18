import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import type {
  Coupon,
  CouponTemplate,
  CouponTemplateAPI,
  CouponTemplateInstance,
  Discount,
} from './types';
import { Company } from '../company/types';
import { isCurrentlyActive } from './utils';
import { getAllTagsWithTagGroup } from '../tag/selectors';
import { RootState } from '../../reducers';
import {
  getAllowedFranchisees,
  getFranchiseCompanyById,
  withAllowed,
  withAllowedOnArray,
} from '../franchise/selectors';

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
  createSelector([selector, getAllTagsWithTagGroup], (coupon, tagList) => {
    if (!coupon) return null;
    if (!Array.isArray(coupon)) {
      return {
        ...coupon,
        blacklist_tags: coupon?.blacklist_tags
          ?.map((id) => tagList.find((tag) => tag.id === id))
          .filter((tag) => tag),
        whitelist_tags: coupon?.whitelist_tags
          .map((id) => tagList.find((tag) => tag.id === id))
          .filter((tag) => tag),
      };
    }
    return coupon.map((_coupon) => ({
      ..._coupon,
      blacklist_tags: _coupon?.blacklist_tags
        ?.map((id: number) => tagList.find((tag) => tag.id === id))
        .filter((tag: number) => tag),
      whitelist_tags: _coupon?.whitelist_tags
        .map((id: number) => tagList.find((tag) => tag.id === id))
        .filter((tag: number) => tag),
    }));
  }),
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

// @ts-expect-error
export const getInactiveCoupons: (State) => Array<Coupon> = createSelector(
  getAvailableCoupons,
  (coupons) => coupons.filter((coupon) => !isCurrentlyActive(coupon)),
);

export const getCouponTemplateData = (state: RootState) =>
  state.coupon.couponTemplate.byId;

const getCouponTemplateIdList = (state: RootState) =>
  state.coupon.couponTemplate.allIds;

export const getCouponTemplateList: (
  state: RootState,
) => Array<CouponTemplate> = createSelector(
  [
    getCouponTemplateData,
    getCouponTemplateIdList,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (data, ids, allowed_franchisee_ids, companyById) =>
    ids
      .map((id: number) => data[id])
      .filter((ct: CouponTemplateAPI) => !ct.disabled)
      .map((ct: CouponTemplateAPI) => ({
        ...ct,
        companies: withAllowed(
          ct.coupon_template_instances
            .filter((cti: CouponTemplateInstance) => !cti.disabled)
            ?.map((cti) => cti.company),
          allowed_franchisee_ids,
          companyById,
          // @ts-expect-error
        )?.filter((c: Company) => !!c),
      })),
);

export const getActiveCouponTemplates: (
  state: RootState,
) => Array<CouponTemplate> = createSelector(
  [getCouponTemplateList],
  (couponTemplateList) =>
    // @ts-expect-error
    couponTemplateList.filter((ct) => isCurrentlyActive(ct)),
);

export const getInactiveCouponTemplates: (
  state: RootState,
) => Array<CouponTemplate> = createSelector(
  [getCouponTemplateList],
  (couponTemplateList) =>
    // @ts-expect-error
    couponTemplateList.filter((ct) => !isCurrentlyActive(ct)),
);

const getActiveCouponTemplatePaginatedState = (state: RootState) =>
  state.coupon.couponTemplatePaginated.activeCoupons;

export const getActiveCouponTemplatePaginated = createSelector(
  [
    getActiveCouponTemplatePaginatedState,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (paginateState, allowed_franchisee_ids, companyById) => {
    const { allIds, byId } = paginateState;
    return {
      ...paginateState,
      coupons: allIds
        .map((id) => byId[id])
        .filter((couponTemplate) => !!couponTemplate)
        .map((_couponTemplate) => ({
          ..._couponTemplate,
          companies: withAllowedOnArray(
            _couponTemplate.coupon_template_instances
              .map(
                (couponTemplateInstance: CouponTemplateInstance) =>
                  !couponTemplateInstance.disabled &&
                  couponTemplateInstance.company,
              )
              .filter(
                (coupon_template_instance_id) => !!coupon_template_instance_id,
              ),
            allowed_franchisee_ids,
            companyById,
          )?.filter((c) => !!c),
        })),
    };
  },
);

const getExpiredActiveCouponTemplatePaginatedState = (state: RootState) =>
  state.coupon.couponTemplatePaginated.expiredActiveCoupons;

export const getExpiredActiveCouponTemplatePaginated = createSelector(
  [
    getExpiredActiveCouponTemplatePaginatedState,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (paginateState, allowed_franchisee_ids, companyById) => {
    const { allIds, byId } = paginateState;
    return {
      ...paginateState,
      coupons: allIds
        .map((id) => byId[id])
        .filter((couponTemplate) => !!couponTemplate)
        .map((_couponTemplate) => ({
          ..._couponTemplate,
          companies: withAllowedOnArray(
            _couponTemplate.coupon_template_instances
              .map(
                (couponTemplateInstance: CouponTemplateInstance) =>
                  !couponTemplateInstance.disabled &&
                  couponTemplateInstance.company,
              )
              .filter(
                (coupon_template_instance_id) => !!coupon_template_instance_id,
              ),
            allowed_franchisee_ids,
            companyById,
          )?.filter((c) => !!c),
        })),
    };
  },
);

const getInActiveCouponTemplatePaginatedState = (state: RootState) =>
  state.coupon.couponTemplatePaginated.inactiveCoupons;

export const getInActiveCouponTemplatePaginated = createSelector(
  [
    getInActiveCouponTemplatePaginatedState,
    getAllowedFranchisees,
    getFranchiseCompanyById,
  ],
  (paginateState, allowed_franchisee_ids, companyById) => {
    const { allIds, byId } = paginateState;
    return {
      ...paginateState,
      coupons: allIds
        .map((id) => byId[id])
        .filter((couponTemplate) => !!couponTemplate)
        .map((_couponTemplate) => ({
          ..._couponTemplate,
          companies: withAllowedOnArray(
            _couponTemplate.coupon_template_instances
              .map(
                (couponTemplateInstance: CouponTemplateInstance) =>
                  !couponTemplateInstance.disabled &&
                  couponTemplateInstance.company,
              )
              .filter(
                (coupon_template_instance_id) => !!coupon_template_instance_id,
              ),
            allowed_franchisee_ids,
            companyById,
          )?.filter((c) => !!c),
        })),
    };
  },
);
const _getId = (state: RootState, id: number) => id;

export const getCouponTemplate: (
  state: RootState,
  id: number,
) => CouponTemplate = createSelector(
  [
    getCouponTemplateData,
    getAllowedFranchisees,
    getFranchiseCompanyById,
    _getId,
  ],
  (data, allowed_franchisee_ids, companyById, id) => {
    const template = data[id];
    if (!template) return null;
    return {
      ...template,
      companies: withAllowed(
        template.coupon_template_instances.map(
          (cti: CouponTemplateInstance) => !cti.disabled && cti.company,
        ),
        allowed_franchisee_ids,
        companyById,
        // @ts-expect-error
      ).filter((c: Company) => !!c),
    };
  },
);
