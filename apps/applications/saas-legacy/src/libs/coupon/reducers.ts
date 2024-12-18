import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { PaginatedResponse } from '../../state/types';
import {
  couponList,
  couponCreateOrUpdate,
  discountList,
  listCouponTemplateActions,
  createOrUpdateCouponTemplateActions,
  deleteCouponTemplateActions,
  retrieveCouponTemplateActions,
  retrieveCouponActions,
  exportCodesAsCsvActions,
  listCouponTemplatePaginatedActions,
} from './actions';

import type {
  Coupon,
  CouponState,
  CouponTemplate,
  CouponTemplateAPI,
  Discount,
} from './types';

const initialState: Immutable.Immutable<CouponState> = Immutable<CouponState>({
  discount: {
    items: [],
    page: null,
    count: null,
    loading: false,
    error: null,
  },
  coupon: {
    currentPage: 1,
    items: [],
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  couponTemplate: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    upsert: {
      loading: false,
      error: null,
    },
  },
  couponTemplatePaginated: {
    activeCoupons: {
      page: 1,
      next_page: null,
      previous_page: null,
      count: 0,
      page_size: 50,
      allIds: [],
      byId: {},
      loading: false,
      error: null,
    },
    expiredActiveCoupons: {
      page: 1,
      next_page: null,
      previous_page: null,
      count: 0,
      page_size: 50,
      allIds: [],
      byId: {},
      loading: false,
      error: null,
    },
    inactiveCoupons: {
      page: 1,
      next_page: null,
      previous_page: null,
      count: 0,
      page_size: 50,
      allIds: [],
      byId: {},
      loading: false,
      error: null,
    },
  },
  exportCodes: {
    loading: false,
    error: null,
  },
});

export default handleActions<Immutable.Immutable<CouponState>, any>(
  {
    [discountList.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['discount', 'loading'], payload);
    },
    [discountList.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: PaginatedResponse<Discount>;
      },
    ) => {
      return state
        .setIn(['discount', 'items'], payload.results)
        .setIn(['discount', 'page'], payload.page)
        .setIn(['discount', 'count'], payload.count)
        .setIn(['discount', 'loading'], false);
    },
    [discountList.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['discount', 'error'], payload);
    },

    [couponList.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['coupon', 'loading'], payload);
    },
    [couponList.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<Coupon> },
    ) => {
      return state
        .setIn(['coupon', 'items'], payload.results)
        .setIn(['coupon', 'currentPage'], payload.page);
    },
    [couponList.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['coupon', 'error'], payload);
    },

    [couponCreateOrUpdate.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['coupon', 'createOrUpdate', 'loading'], payload);
    },
    [couponCreateOrUpdate.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['coupon', 'createOrUpdate', 'error'], payload);
    },
    [listCouponTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['couponTemplate', 'loading'], payload);
    },
    [listCouponTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['couponTemplate', 'error'], payload);
    },
    [listCouponTemplateActions.success.toString()]: (
      state,
      { payload }: { payload: CouponTemplate[] },
    ) => {
      return state
        .setIn(
          ['couponTemplate', 'allIds'],
          payload.map((couponTemplate: CouponTemplate) => couponTemplate.id),
        )
        .merge(
          {
            couponTemplate: {
              byId: payload.reduce<{ [key: number]: CouponTemplate }>(
                (acc, v) => ({
                  ...acc,
                  [v.id]: v,
                }),
                {} as CouponTemplate,
              ),
            },
          },
          { deep: true },
        );
    },
    [createOrUpdateCouponTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['couponTemplate', 'upsert', 'loading'], payload);
    },
    [createOrUpdateCouponTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['couponTemplate', 'upsert', 'error'], payload);
    },
    [createOrUpdateCouponTemplateActions.success.toString()]: (
      state,
      { payload }: { payload: CouponTemplate },
    ) => {
      return state
        .setIn(
          ['couponTemplate', 'allIds'],
          [
            payload.id,
            ...state.couponTemplate.allIds.filter((id) => id !== payload.id),
          ],
        )
        .setIn(['couponTemplate', 'byId', payload.id], payload);
    },
    [deleteCouponTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['couponTemplate', 'upsert', 'loading'], payload);
    },
    [deleteCouponTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['couponTemplate', 'upsert', 'error'], payload);
    },
    [deleteCouponTemplateActions.success.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state.setIn(['couponTemplate', 'byId', payload, 'disabled'], true);
    },
    [retrieveCouponTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['couponTemplate', 'loading'], payload);
    },
    [retrieveCouponTemplateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['couponTemplate', 'error'], payload);
    },
    [retrieveCouponTemplateActions.success.toString()]: (
      state,
      { payload }: { payload: CouponTemplate },
    ) => {
      return state.setIn(['couponTemplate', 'byId', payload.id], payload);
    },
    [retrieveCouponActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['coupon', 'loading'], payload);
    },
    [retrieveCouponActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['coupon', 'error'], payload);
    },
    [retrieveCouponActions.success.toString()]: (
      state,
      { payload }: { payload: Coupon },
    ) => {
      return state.setIn(
        ['coupon', 'items'],
        [
          ...state.coupon.items.filter((item) => item.id !== payload.id),
          payload,
        ],
      );
    },
    [exportCodesAsCsvActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['exportCodes', 'error'], payload);
    },
    [exportCodesAsCsvActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['exportCodes', 'loading'], payload);
    },
    // =====
    // ===== PAGINATED ACTIVE AND NOT EXPIRED COUPON ACTIONS
    [listCouponTemplatePaginatedActions.isLoadingActiveCouponTemplate.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          ['couponTemplatePaginated', 'activeCoupons', 'loading'],
          payload,
        );
      },
    [listCouponTemplatePaginatedActions.errorActiveCouponTemplate.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['couponTemplatePaginated', 'activeCoupons', 'error'],
        payload,
      );
    },
    [listCouponTemplatePaginatedActions.successActiveCouponTemplate.toString()]:
      (
        state,
        { payload }: { payload: PaginatedResponse<CouponTemplateAPI> },
      ) => {
        const { next_page, results, count, page } = payload;
        return state
          .setIn(['couponTemplatePaginated', 'activeCoupons', 'page'], page)
          .setIn(
            ['couponTemplatePaginated', 'activeCoupons', 'next_page'],
            next_page,
          )
          .setIn(['couponTemplatePaginated', 'activeCoupons', 'count'], count)
          .setIn(
            ['couponTemplatePaginated', 'activeCoupons', 'allIds'],
            (results || []).map((template) => template.id),
          )
          .merge(
            {
              couponTemplatePaginated: {
                activeCoupons: {
                  byId: (results || []).reduce(
                    (accumulator, couponTemplate) => ({
                      ...accumulator,
                      [couponTemplate.id]: couponTemplate,
                    }),
                    {},
                  ),
                },
              },
            },
            { deep: true },
          );
      },

    // =====
    // ===== PAGINATED ACTIVE AND EXPIRED COUPON ACTIONS
    [listCouponTemplatePaginatedActions.isLoadingExpiredActiveCouponTemplate.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          ['couponTemplatePaginated', 'expiredActiveCoupons', 'loading'],
          payload,
        );
      },
    [listCouponTemplatePaginatedActions.errorExpiredActiveCouponTemplate.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(
          ['couponTemplatePaginated', 'expiredActiveCoupons', 'error'],
          payload,
        );
      },
    [listCouponTemplatePaginatedActions.successExpiredActiveCouponTemplate.toString()]:
      (
        state,
        { payload }: { payload: PaginatedResponse<CouponTemplateAPI> },
      ) => {
        const { next_page, results, count, page } = payload;
        return state
          .setIn(
            ['couponTemplatePaginated', 'expiredActiveCoupons', 'page'],
            page,
          )
          .setIn(
            ['couponTemplatePaginated', 'expiredActiveCoupons', 'next_page'],
            next_page,
          )
          .setIn(
            ['couponTemplatePaginated', 'expiredActiveCoupons', 'count'],
            count,
          )
          .setIn(
            ['couponTemplatePaginated', 'expiredActiveCoupons', 'allIds'],
            (results || []).map((template) => template.id),
          )
          .merge(
            {
              couponTemplatePaginated: {
                expiredActiveCoupons: {
                  byId: (results || []).reduce(
                    (accumulator, couponTemplate) => ({
                      ...accumulator,
                      [couponTemplate.id]: couponTemplate,
                    }),
                    {},
                  ),
                },
              },
            },
            { deep: true },
          );
      },

    // =====
    // ===== PAGINATED INACTIVE COUPON ACTIONS (not active)
    [listCouponTemplatePaginatedActions.isLoadingInActiveCouponTemplate.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          ['couponTemplatePaginated', 'inactiveCoupons', 'loading'],
          payload,
        );
      },
    [listCouponTemplatePaginatedActions.errorInActiveCouponTemplate.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(
          ['couponTemplatePaginated', 'inactiveCoupons', 'error'],
          payload,
        );
      },
    [listCouponTemplatePaginatedActions.successInActiveCouponTemplate.toString()]:
      (
        state,
        { payload }: { payload: PaginatedResponse<CouponTemplateAPI> },
      ) => {
        const { next_page, results, count, page } = payload;
        return state
          .setIn(['couponTemplatePaginated', 'inactiveCoupons', 'page'], page)
          .setIn(
            ['couponTemplatePaginated', 'inactiveCoupons', 'next_page'],
            next_page,
          )
          .setIn(['couponTemplatePaginated', 'inactiveCoupons', 'count'], count)
          .setIn(
            ['couponTemplatePaginated', 'inactiveCoupons', 'allIds'],
            (results || []).map((template) => template.id),
          )
          .merge(
            {
              couponTemplatePaginated: {
                inactiveCoupons: {
                  byId: (results || []).reduce(
                    (accumulator, couponTemplate) => ({
                      ...accumulator,
                      [couponTemplate.id]: couponTemplate,
                    }),
                    {},
                  ),
                },
              },
            },
            { deep: true },
          );
      },
  },

  initialState,
);
