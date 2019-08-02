// @flow

import { createAction } from 'redux-actions';

import * as api from './api';

import type { Dispatch, State, ThunkAction } from '../../state/types';

import type { ProductData } from './types';

export const deliverFeesList = {
  error: createAction('DELIVERY_FEE/LIST/ERROR'),
  isLoading: createAction('DELIVERY_FEE/LIST/IS_LOADING'),
  success: createAction('DELIVERY_FEE/LIST/SUCCESS'),
};

export const deliverFeesCreateOrUpdate = {
  error: createAction('DELIVERY_FEE/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('DELIVERY_FEE/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('DELIVERY_FEE/CREATE_OR_UPDATE/SUCCESS'),
};

export const configurationDetail = {
  error: createAction('ORDER_CONFIGURATION/DETAIL/ERROR'),
  isLoading: createAction('ORDER_CONFIGURATION/DETAIL/IS_LOADING'),
  success: createAction('ORDER_CONFIGURATION/DETAIL/SUCCESS'),
};

export const configurationUpdate = {
  error: createAction('ORDER_CONFIGURATION/UPDATE/ERROR'),
  isLoading: createAction('ORDER_CONFIGURATION/UPDATE/IS_LOADING'),
};

export const orderDetailActions = {
  error: createAction('ORDER/DETAIL/ERROR'),
  isLoading: createAction('ORDER/DETAIL/IS_LOADING'),
  success: createAction('ORDER/DETAIL/SUCCESS'),
};

export const orderListActions = {
  error: createAction('ORDER/LIST/ERROR'),
  isLoading: createAction('ORDER/LIST/IS_LOADING'),
  success: createAction('ORDER/LIST/SUCCESS'),
};

export const currentOrderCreateOrUpdateActions = {
  error: createAction('ORDER/PATCH/ERROR'),
  isLoading: createAction('ORDER/PATCH/IS_LOADING'),
  success: createAction('ORDER/PATCH/SUCCESS'),
};

export const currentOrderActions = {
  error: createAction('ORDER/CURRENT/ERROR'),
  isLoading: createAction('ORDER/CURRENT/IS_LOADING'),
  success: createAction('ORDER/CURRENT/SUCCESS'),
};

export const productListActions = {
  error: createAction('PRODUCT/LIST/ERROR'),
  isLoading: createAction('PRODUCT/LIST/IS_LOADING'),
  success: createAction('PRODUCT/LIST/SUCCESS'),
};

export const addProductActions = {
  error: createAction('PRODUCT/ADD/ERROR'),
  isLoading: createAction('PRODUCT/ADD/IS_LOADING'),
  success: createAction('PRODUCT/ADD/SUCCESS'),
};

export const removeProductActions = {
  error: createAction('PRODUCT/REMOVE/ERROR'),
  isLoading: createAction('PRODUCT/REMOVE/IS_LOADING'),
  success: createAction('PRODUCT/REMOVE/SUCCESS'),
};

export function fetchAllDeliveryFee(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deliverFeesList.isLoading(true));
    dispatch(deliverFeesList.error(null));

    try {
      const response = await api.fetchAllDeliveryFee();
      dispatch(deliverFeesList.success(response.data));
    } catch (error) {
      dispatch(deliverFeesList.error(error));
    }

    dispatch(deliverFeesList.isLoading(false));
  };
}
export function disableDeliveryFee(data: *): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deliverFeesCreateOrUpdate.isLoading(true));
    dispatch(deliverFeesCreateOrUpdate.error(null));

    try {
      const response = await api.updateDeliveryFee({ ...data, disabled: true });
      dispatch(deliverFeesCreateOrUpdate.success(response.data));
    } catch (error) {
      dispatch(deliverFeesCreateOrUpdate.error(error));
    }

    dispatch(deliverFeesCreateOrUpdate.isLoading(false));
  };
}

export function createOrUpdateDeliveryFee(data: *): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deliverFeesCreateOrUpdate.isLoading(true));
    dispatch(deliverFeesCreateOrUpdate.error(null));

    try {
      const apiCall = data.id ? api.updateDeliveryFee : api.createDeliveryFee;
      const response = await apiCall(data);
      dispatch(deliverFeesCreateOrUpdate.success(response.data));
    } catch (error) {
      dispatch(deliverFeesCreateOrUpdate.error(error));
    }

    dispatch(deliverFeesCreateOrUpdate.isLoading(false));
  };
}

export function patchConfiguration(data: *): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(configurationUpdate.isLoading(true));
    dispatch(configurationUpdate.error(null));

    try {
      const response = await api.patchConfiguration(data);
      dispatch(configurationDetail.success(response.data));
    } catch (error) {
      dispatch(configurationUpdate.error(error));
    }

    dispatch(configurationUpdate.isLoading(false));
  };
}

export function fetchConfiguration(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(configurationDetail.isLoading(true));
    dispatch(configurationDetail.error(null));

    try {
      const { data } = await api.fetchConfiguration();
      dispatch(configurationDetail.success(data));
    } catch (error) {
      dispatch(configurationDetail.error(error));
    }

    dispatch(configurationDetail.isLoading(false));
  };
}

export function patchOrder(
  id: string,
  data_: *,
  options: ?{ onError: ?() => void, onSuccess: ?() => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(orderDetailActions.isLoading(true));
    dispatch(orderDetailActions.error(null));

    try {
      const { data } = await api.patchOrder(id, data_);
      dispatch(orderDetailActions.success(data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(orderDetailActions.error(error));
      if (options && options.onError) options.onError();
    }

    dispatch(orderDetailActions.isLoading(false));
  };
}

export function resetOrders(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(orderListActions.isLoading(false));
    dispatch(
      orderListActions.success({
        nextPage: 1,
        orders: [],
      }),
    );
  };
}

export function getOrCreateCurrentOrder(companyId: ?number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentOrderActions.isLoading(true));
    dispatch(currentOrderActions.error(null));

    try {
      const { data } = await api.fetchCurrentOrder(companyId);
      dispatch(currentOrderActions.success(data));
    } catch (error) {
      dispatch(currentOrderActions.error(error));
    }

    dispatch(currentOrderActions.isLoading(false));
  };
}

export function updateCurrentOrder(id: string, data_: *): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentOrderCreateOrUpdateActions.isLoading(true));
    dispatch(currentOrderCreateOrUpdateActions.error(null));

    try {
      const { data } = await api.patchOrder(id, data_);
      dispatch(currentOrderCreateOrUpdateActions.success(data));
    } catch (error) {
      dispatch(currentOrderCreateOrUpdateActions.error(error));
    }

    dispatch(currentOrderCreateOrUpdateActions.isLoading(false));
  };
}

export function fetchOrder(id: string): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(orderDetailActions.isLoading(true));
    dispatch(orderDetailActions.error(null));

    try {
      const { data } = await api.fetchOrder(id);
      dispatch(orderDetailActions.success(data));
    } catch (error) {
      dispatch(orderDetailActions.error(error));
    }

    dispatch(orderDetailActions.isLoading(false));
  };
}

export function fetchOrders(): ThunkAction {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch(orderListActions.isLoading(true));
    dispatch(orderListActions.error(null));

    try {
      const page = getState().order.order.nextPage;
      const res = await api.fetchOrders(page);
      dispatch(
        orderListActions.success({
          orders: [...getState().order.order.items, ...res.data.results],
          nextPage: res.data.next_page,
        }),
      );
    } catch (error) {
      dispatch(orderListActions.error(error));
    }

    dispatch(orderListActions.isLoading(false));
  };
}

export function resetAndFetchOrders(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(resetOrders());
    dispatch(fetchOrders());
  };
}

export function addProductToOrder(
  productData: ProductData,
  orderId: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentOrderActions.isLoading(true));
    dispatch(currentOrderActions.error(null));

    try {
      const { data } = await api.addProduct(productData, orderId);
      dispatch(currentOrderActions.success(data));
    } catch (error) {
      dispatch(currentOrderActions.error(error));
    }

    dispatch(currentOrderActions.isLoading(false));
  };
}

export function removeProductFromOrder(
  productData: ProductData,
  orderId: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(currentOrderActions.isLoading(true));
    dispatch(currentOrderActions.error(null));

    try {
      const { data } = await api.removeProduct(productData, orderId);
      dispatch(currentOrderActions.success(data));
    } catch (error) {
      dispatch(currentOrderActions.error(error));
    }

    dispatch(currentOrderActions.isLoading(false));
  };
}
