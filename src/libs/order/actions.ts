// @ts-nocheck
import { createAction } from 'redux-actions';
import * as api from './api';
import type {
  Dispatch,
  GetState,
  ThunkAction,
  OptionCallback,
} from '../../state/types';
import type {
  DeliveryFee,
  DeliveryFeeCreationOrUpdatePayload,
  DeliveryConfiguration,
  OrderWithProducts,
  OrderListActions,
  Order,
} from '#libs/order/types';

export const deliverFeesList = {
  error: createAction<Error | null>('DELIVERY_FEE/LIST/ERROR'),
  isLoading: createAction<boolean>('DELIVERY_FEE/LIST/IS_LOADING'),
  success: createAction<Array<DeliveryFee>>('DELIVERY_FEE/LIST/SUCCESS'),
};

export const deliverFeesCreateOrUpdate = {
  error: createAction<Error | null>('DELIVERY_FEE/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction<boolean>('DELIVERY_FEE/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction<DeliveryFee>('DELIVERY_FEE/CREATE_OR_UPDATE/SUCCESS'),
};

export const configurationDetail = {
  error: createAction<Error | null>('ORDER_CONFIGURATION/DETAIL/ERROR'),
  isLoading: createAction<boolean>('ORDER_CONFIGURATION/DETAIL/IS_LOADING'),
  success: createAction<DeliveryConfiguration>(
    'ORDER_CONFIGURATION/DETAIL/SUCCESS',
  ),
};

export const configurationUpdate = {
  error: createAction<Error | null>('ORDER_CONFIGURATION/UPDATE/ERROR'),
  isLoading: createAction<boolean>('ORDER_CONFIGURATION/UPDATE/IS_LOADING'),
};

export const orderDetailActions = {
  error: createAction<Error | null>('ORDER/DETAIL/ERROR'),
  isLoading: createAction<boolean>('ORDER/DETAIL/IS_LOADING'),
  success: createAction<OrderWithProducts>('ORDER/DETAIL/SUCCESS'),
};

export const orderListActions = {
  error: createAction<Error | null>('ORDER/LIST/ERROR'),
  isLoading: createAction<boolean>('ORDER/LIST/IS_LOADING'),
  success: createAction<OrderListActions>('ORDER/LIST/SUCCESS'),
};

export const currentOrderCreateOrUpdateActions = {
  error: createAction<Error | null>('ORDER/PATCH/ERROR'),
  isLoading: createAction<boolean>('ORDER/PATCH/IS_LOADING'),
  success: createAction<OrderWithProducts>('ORDER/PATCH/SUCCESS'),
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
export function disableDeliveryFee(
  data: DeliveryFeeCreationOrUpdatePayload,
): ThunkAction {
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

export function createOrUpdateDeliveryFee(
  data: DeliveryFeeCreationOrUpdatePayload,
): ThunkAction {
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

export function patchConfiguration(data: DeliveryConfiguration): ThunkAction {
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
  data_: Partial<Order>,
  options?: OptionCallback,
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

export function fetchOrder(
  id: string,
  options: OptionCallback<OrderWithProducts>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(orderDetailActions.isLoading(true));
    dispatch(orderDetailActions.error(null));

    try {
      const { data } = await api.fetchOrder(id);
      dispatch(orderDetailActions.success(data));
      if (options && options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      dispatch(orderDetailActions.error(error));
      if (options && options.onError) {
        options.onError(error);
      }
    }

    dispatch(orderDetailActions.isLoading(false));
  };
}

export function fetchOrders(chosenPage?: number): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(orderListActions.isLoading(true));
    dispatch(orderListActions.error(null));

    try {
      const page = getState().order.order.nextPage;
      const res = await api.fetchOrders(chosenPage ?? page);
      dispatch(
        orderListActions.success({
          orders: [...res.data.results],
          nextPage: res.data.next_page,
          count: res.data.count,
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
