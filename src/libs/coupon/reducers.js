// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  couponList,
  couponCreateOrUpdate,
  discountList,
  listCouponTemplateActions,
  createOrUpdateCouponTemplateActions,
  deleteCouponTemplateActions,
  retrieveCouponTemplateActions,
} from './actions';

import type { CouponState } from './types';

const initialState: CouponState = Immutable({
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

export default handleActions(
  {
    [discountList.isLoading]: (state, { payload }) => {
      return state.setIn(['discount', 'loading'], payload);
    },
    [discountList.success]: (state, { payload }) => {
      return state
        .setIn(['discount', 'items'], payload.results)
        .setIn(['discount', 'page'], payload.page)
        .setIn(['discount', 'count'], payload.count)
        .setIn(['discount', 'loading'], false);
    },
    [discountList.error]: (state, { payload }) => {
      return state.setIn(['discount', 'error'], payload);
    },

    [couponList.isLoading]: (state, { payload }) => {
      return state.setIn(['coupon', 'loading'], payload);
    },
    [couponList.success]: (state, { payload }) => {
      return state
        .setIn(['coupon', 'items'], payload.items)
        .setIn(['coupon', 'currentPage'], payload.page);
    },
    [couponList.error]: (state, { payload }) => {
      return state.setIn(['coupon', 'error'], payload);
    },

    [couponCreateOrUpdate.isLoading]: (state, { payload }) => {
      return state.setIn(['coupon', 'createOrUpdate', 'loading'], payload);
    },
    [couponCreateOrUpdate.error]: (state, { payload }) => {
      return state.setIn(['coupon', 'createOrUpdate', 'error'], payload);
    },
    [listCouponTemplateActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['couponTemplate', 'loading'], payload);
    },
    [listCouponTemplateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['couponTemplate', 'error'], payload);
    },
    [listCouponTemplateActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['couponTemplate', 'allIds'],
          payload.map((c) => c.id),
        )
        .merge(
          {
            couponTemplate: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [createOrUpdateCouponTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['couponTemplate', 'upsert', 'loading'], payload);
    },
    [createOrUpdateCouponTemplateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['couponTemplate', 'upsert', 'error'], payload);
    },
    [createOrUpdateCouponTemplateActions.success.toString()]: (
      state,
      { payload },
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
      { payload },
    ) => {
      return state.setIn(['couponTemplate', 'upsert', 'loading'], payload);
    },
    [deleteCouponTemplateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['couponTemplate', 'upsert', 'error'], payload);
    },
    [deleteCouponTemplateActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['couponTemplate', 'byId', payload, 'disabled'], true);
    },
    [retrieveCouponTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['couponTemplate', 'loading'], payload);
    },
    [retrieveCouponTemplateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['couponTemplate', 'error'], payload);
    },
    [retrieveCouponTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['couponTemplate', 'byId', payload.id], payload);
    },
  },
  initialState,
);
