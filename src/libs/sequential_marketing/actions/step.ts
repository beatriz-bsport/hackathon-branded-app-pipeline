import { createAction } from 'redux-actions';
import {
  OptionCallback,
  Dispatch,
  OptionPaginatedCallback,
  PaginatedResponse,
} from '../../../state/types';

import {
  retrieveCadenceStep as retrieveCadenceStepAPI,
  fetchCadenceStepList as fetchCadenceStepListAPI,
  updateCadenceStepCanvasPosition as updateCadenceStepCanvasPositionAPI,
  updateCadenceStep as updateCadenceStepAPI,
  deleteCadenceStep as deleteCadenceStepAPI,
} from '#libs/sequential_marketing/api';

import type {
  CadenceStep,
  CadenceStepQueryParams,
} from '#libs/sequential_marketing/types';

export const retrieveCadenceStepActions = {
  isLoading: createAction<boolean>('CADENCE_STEP/RETRIEVE/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP/RETRIEVE/ERROR'),
  success: createAction<CadenceStep>('CADENCE_STEP/RETRIEVE/SUCCESS'),
};

export function retrieveCadenceStep(
  id: number,
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCadenceStepActions.isLoading(true));
    dispatch(retrieveCadenceStepActions.error(null));

    try {
      const response = await retrieveCadenceStepAPI(id);
      dispatch(retrieveCadenceStepActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveCadenceStepActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(retrieveCadenceStepActions.isLoading(false));
  };
}

export const fetchCadenceStepListActions = {
  isLoading: createAction<boolean>('CADENCE_STEP/LIST/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP/LIST/ERROR'),
  success: createAction<PaginatedResponse<CadenceStep>>(
    'CADENCE_STEP/LIST/SUCCESS',
  ),
};

export function fetchCadenceStepList(
  params?: CadenceStepQueryParams,
  options?: OptionPaginatedCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCadenceStepListActions.isLoading(true));
    dispatch(fetchCadenceStepListActions.error(null));

    try {
      const response = await fetchCadenceStepListAPI(params);
      dispatch(fetchCadenceStepListActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchCadenceStepListActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(fetchCadenceStepListActions.isLoading(false));
  };
}

export const updateCadenceStepCanvasPositionActions = {
  isLoading: createAction<boolean>('CADENCE_STEP/UPDATE_CANVAS/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP/UPDATE_CANVAS/ERROR'),
  success: createAction<CadenceStep>('CADENCE_STEP/UPDATE_CANVAS/SUCCESS'),
};

export function updateCadenceStepCanvasPosition(
  id: number,
  position: { x: number; y: number },
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateCadenceStepCanvasPositionActions.isLoading(true));
    dispatch(updateCadenceStepCanvasPositionActions.error(null));

    try {
      const response = await updateCadenceStepCanvasPositionAPI(id, position);
      dispatch(updateCadenceStepCanvasPositionActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateCadenceStepCanvasPositionActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(updateCadenceStepCanvasPositionActions.isLoading(false));
  };
}

export const updateCadenceStepActions = {
  isLoading: createAction<boolean>('CADENCE_STEP/UPDATE/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP/UPDATE/ERROR'),
  success: createAction<CadenceStep>('CADENCE_STEP/UPDATE/SUCCESS'),
};

export function updateCadenceStep(
  id: number,
  data: { name: string },
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateCadenceStepActions.isLoading(true));
    dispatch(updateCadenceStepActions.error(null));

    try {
      const response = await updateCadenceStepAPI(id, data);
      dispatch(updateCadenceStepActions.success(response.data));
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateCadenceStepActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(updateCadenceStepActions.isLoading(false));
  };
}

export const deleteCadenceStepActions = {
  isLoading: createAction<boolean>('CADENCE_STEP/DELETE/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP/DELETE/ERROR'),
  success: createAction<{ id: number }>('CADENCE_STEP/DELETE/SUCCESS'),
};

export function deleteCadenceStep(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteCadenceStepActions.isLoading(true));
    dispatch(deleteCadenceStepActions.error(null));

    try {
      await deleteCadenceStepAPI(id);
      dispatch(deleteCadenceStepActions.success({ id }));
      options && options.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(deleteCadenceStepActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(deleteCadenceStepActions.isLoading(false));
  };
}
