// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  orderListActions,
  orderDetailActions,
  currentOrderActions,
  currentOrderCreateOrUpdateActions,
  productListActions,
  addProductActions,
  removeProductActions,
} from './actions';

import type { OrderState } from './types';

const initialState: OrderState = Immutable({
  order: {
    items: [],
    current: {
      data: null,
      loading: false,
      error: null,
    },
    nextPage: 1,
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  product: {
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
    // ORDER
    // --------
    [orderListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['order', 'loading'], payload);
    },
    [orderListActions.error]: (state, { payload }) => {
      return state.setIn(['order', 'error'], payload);
    },
    [orderListActions.success]: (state, { payload }) => {
      return state
        .setIn(['order', 'items'], payload.orders)
        .setIn(['order', 'nextPage'], payload.nextPage);
    },
    [orderDetailActions.isLoading]: (state, { payload }) => {
      return state.setIn(['order', 'loading'], payload);
    },
    [orderDetailActions.error]: (state, { payload }) => {
      return state.setIn(['order', 'error'], payload);
    },
    [orderDetailActions.success]: (state, { payload }) => {
      let idx = state.order.items.findIndex((o) => o.id === payload.id);
      if (idx === -1) {
        idx = state.order.items.length;
      }
      return state.setIn(['order', 'items', idx], payload);
    },

    [currentOrderActions.success]: (state, { payload }) => {
      return state.setIn(['order', 'current', 'data'], payload);
    },
    [currentOrderActions.isLoading]: (state, { payload }) => {
      return state.setIn(['order', 'current', 'loading'], payload);
    },
    [currentOrderActions.error]: (state, { payload }) => {
      return state.setIn(['order', 'current', 'error'], payload);
    },
    [currentOrderCreateOrUpdateActions.success]: (state, { payload }) => {
      return state.setIn(['order', 'current', 'data'], payload);
    },
    [currentOrderCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['order', 'current', 'loading'], payload);
    },
    [currentOrderCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['order', 'current', 'error'], payload);
    },

    // PRODUCT
    //  --------------
    [productListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['product', 'loading'], payload);
    },
    [productListActions.error]: (state, { payload }) => {
      return state.setIn(['product', 'error'], payload);
    },
    [productListActions.success]: (state, { payload }) => {
      return state.setIn(['order', 'items'], payload);
    },
    [addProductActions.success]: (state, { payload }) => {
      return state.setIn(
        ['product', 'items', state.product.items.length],
        payload,
      );
    },
    [addProductActions.isLoading]: (state, { payload }) => {
      return state.setIn(['product', 'createOrUpdate', 'loading'], payload);
    },
    [addProductActions.error]: (state, { payload }) => {
      return state.setIn(['product', 'createOrUpdate', 'error'], payload);
    },
    [removeProductActions.success]: (state, { payload }) => {
      return state.setIn(
        ['product', 'items'],
        state.product.items.filter((p) => p.id !== payload),
      );
    },
    [removeProductActions.isLoading]: (state, { payload }) => {
      return state.setIn(['product', 'createOrUpdate', 'loading'], payload);
    },
    [removeProductActions.error]: (state, { payload }) => {
      return state.setIn(['product', 'createOrUpdate', 'error'], payload);
    },
  },
  initialState,
);
