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
} from './actions';

import type { Coupon, CouponState, CouponTemplate, Discount } from './types';

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
  },
  initialState,
);
