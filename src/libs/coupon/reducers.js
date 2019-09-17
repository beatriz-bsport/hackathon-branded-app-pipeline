// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { couponList, couponCreateOrUpdate, discountList } from './actions';

import type { CouponState } from './types';

const initialState: CouponState = Immutable({
  discount: {
    items: [],
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
});

export default handleActions(
  {
    [discountList.isLoading]: (state, { payload }) => {
      return state.setIn(['discount', 'loading'], payload);
    },
    [discountList.success]: (state, { payload }) => {
      return state.setIn(['discount', 'items'], payload);
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
  },
  initialState,
);
