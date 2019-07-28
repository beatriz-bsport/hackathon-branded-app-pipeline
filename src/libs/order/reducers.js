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
  configurationDetail,
  configurationUpdate,
  deliverFeesList,
  deliverFeesCreateOrUpdate,
} from './actions';

import type { OrderState } from './types';

const initialState: OrderState = Immutable({
  deliveryFee: {
    items: [],
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  configuration: {
    data: null,
    loading: false,
    error: null,
    update: {
      loading: false,
      error: null,
    },
  },
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
    // DELIVERY FEE
    // ------------
    [deliverFeesList.isLoading]: (state, { payload }) => {
      return state.setIn(['deliveryFee', 'loading'], payload);
    },
    [deliverFeesList.error]: (state, { payload }) => {
      return state.setIn(['deliveryFee', 'error'], payload);
    },
    [deliverFeesList.success]: (state, { payload }) => {
      return state.setIn(['deliveryFee', 'items'], payload);
    },
    [deliverFeesCreateOrUpdate.success]: (state, { payload }) => {
      const idx = state.deliveryFee.items.findIndex(
        (df) => df.id === payload.id,
      );
      return state.setIn(
        [
          'deliveryFee',
          'items',
          idx === -1 ? state.deliveryFee.items.length : idx,
        ],
        payload,
      );
    },
    [deliverFeesCreateOrUpdate.isLoading]: (state, { payload }) => {
      return state.setIn(['deliveryFee', 'createOrUpdate', 'loading'], payload);
    },
    [deliverFeesCreateOrUpdate.error]: (state, { payload }) => {
      return state.setIn(['deliveryFee', 'error'], payload);
    },
    // CONFIGURATION
    // ----------
    [configurationDetail.isLoading]: (state, { payload }) => {
      return state.setIn(['configuration', 'loading'], payload);
    },
    [configurationDetail.error]: (state, { payload }) => {
      return state.setIn(['configuration', 'error'], payload);
    },
    [configurationDetail.success]: (state, { payload }) => {
      return state.setIn(['configuration', 'data'], payload);
    },
    [configurationUpdate.isLoading]: (state, { payload }) => {
      return state.setIn(['configuration', 'loading'], payload);
    },
    [configurationUpdate.error]: (state, { payload }) => {
      return state.setIn(['configuration', 'error'], payload);
    },
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
