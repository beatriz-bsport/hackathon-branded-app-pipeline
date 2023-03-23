import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  orderListActions,
  orderDetailActions,
  currentOrderCreateOrUpdateActions,
  configurationDetail,
  configurationUpdate,
  deliverFeesList,
  deliverFeesCreateOrUpdate,
} from '#libs/order/actions';

import type {
  OrderState,
  DeliveryFee,
  DeliveryConfiguration,
  OrderWithProducts,
  OrderListActions,
} from '#libs/order/types';

type Payload<T> = { payload: T };

const initialState: Immutable.Immutable<OrderState> = Immutable<OrderState>({
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

export default handleActions<Immutable.Immutable<OrderState>, any>(
  {
    // DELIVERY FEE
    // ------------
    [deliverFeesList.isLoading.toString()]: (
      state,
      { payload }: Payload<boolean>,
    ) => {
      return state.setIn(['deliveryFee', 'loading'], payload);
    },
    [deliverFeesList.error.toString()]: (
      state,
      { payload }: Payload<null | Error>,
    ) => {
      return state.setIn(['deliveryFee', 'error'], payload);
    },
    [deliverFeesList.success.toString()]: (
      state,
      { payload }: Payload<Array<DeliveryFee>>,
    ) => {
      return state.setIn(['deliveryFee', 'items'], payload);
    },
    [deliverFeesCreateOrUpdate.success.toString()]: (
      state,
      { payload }: Payload<DeliveryFee>,
    ) => {
      const idx = state.deliveryFee.items.findIndex(
        (df: DeliveryFee) => df.id === payload.id,
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
    [deliverFeesCreateOrUpdate.isLoading.toString()]: (
      state,
      { payload }: Payload<boolean>,
    ) => {
      return state.setIn(['deliveryFee', 'createOrUpdate', 'loading'], payload);
    },
    [deliverFeesCreateOrUpdate.error.toString()]: (
      state,
      { payload }: Payload<null | Error>,
    ) => {
      return state.setIn(['deliveryFee', 'error'], payload);
    },
    // CONFIGURATION
    // ----------
    [configurationDetail.isLoading.toString()]: (
      state,
      { payload }: Payload<boolean>,
    ) => {
      return state.setIn(['configuration', 'loading'], payload);
    },
    [configurationDetail.error.toString()]: (
      state,
      { payload }: Payload<null | Error>,
    ) => {
      return state.setIn(['configuration', 'error'], payload);
    },
    [configurationDetail.success.toString()]: (
      state,
      { payload }: Payload<DeliveryConfiguration>,
    ) => {
      return state.setIn(['configuration', 'data'], payload);
    },
    [configurationUpdate.isLoading.toString()]: (
      state,
      { payload }: Payload<boolean>,
    ) => {
      return state.setIn(['configuration', 'loading'], payload);
    },
    [configurationUpdate.error.toString()]: (
      state,
      { payload }: Payload<null | Error>,
    ) => {
      return state.setIn(['configuration', 'error'], payload);
    },
    // ORDER
    // --------
    [orderListActions.isLoading.toString()]: (
      state,
      { payload }: Payload<boolean>,
    ) => {
      return state.setIn(['order', 'loading'], payload);
    },
    [orderListActions.error.toString()]: (
      state,
      { payload }: Payload<null | Error>,
    ) => {
      return state.setIn(['order', 'error'], payload);
    },
    [orderListActions.success.toString()]: (
      state,
      { payload }: Payload<OrderListActions>,
    ) => {
      return state
        .setIn(['order', 'items'], payload.orders)
        .setIn(['order', 'nextPage'], payload.nextPage);
    },
    [orderDetailActions.isLoading.toString()]: (
      state,
      { payload }: Payload<boolean>,
    ) => {
      return state.setIn(['order', 'loading'], payload);
    },
    [orderDetailActions.error.toString()]: (
      state,
      { payload }: Payload<null | Error>,
    ) => {
      return state.setIn(['order', 'error'], payload);
    },
    [orderDetailActions.success.toString()]: (
      state,
      { payload }: Payload<OrderWithProducts>,
    ) => {
      let idx = state.order.items.findIndex((o) => o.id === payload.id);
      if (idx === -1) {
        idx = state.order.items.length;
      }
      return state.setIn(['order', 'items', idx], payload);
    },

    [currentOrderCreateOrUpdateActions.success.toString()]: (
      state,
      { payload }: Payload<OrderWithProducts>,
    ) => {
      return state.setIn(['order', 'current', 'data'], payload);
    },
    [currentOrderCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload }: Payload<boolean>,
    ) => {
      return state.setIn(['order', 'current', 'loading'], payload);
    },
    [currentOrderCreateOrUpdateActions.error.toString()]: (
      state,
      { payload }: Payload<null | Error>,
    ) => {
      return state.setIn(['order', 'current', 'error'], payload);
    },
  },
  initialState,
);
