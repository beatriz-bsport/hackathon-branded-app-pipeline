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
  changeCadenceStepInExit as changeCadenceStepInExitAPI,
  updateCadenceStep as updateCadenceStepAPI,
  deleteCadenceStep as deleteCadenceStepAPI,
} from '#libs/sequential_marketing/api';

import type {
  CadenceStep,
  CadenceStepQueryParams,
  UpdatedTriggersList,
} from '#libs/sequential_marketing/types';
import { DestinationStatus } from '../constants';

export const retrieveCadenceStepActions = {
  isLoading: createAction<boolean>('CADENCE_STEP_WIP/RETRIEVE/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP_WIP/RETRIEVE/ERROR'),
  success: createAction<CadenceStep>('CADENCE_STEP_WIP/RETRIEVE/SUCCESS'),
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
  isLoading: createAction<boolean>('CADENCE_STEP_WIP/LIST/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP_WIP/LIST/ERROR'),
  success: createAction<PaginatedResponse<CadenceStep>>(
    'CADENCE_STEP_WIP/LIST/SUCCESS',
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
  isLoading: createAction<boolean>('CADENCE_STEP_WIP/UPDATE_CANVAS/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP_WIP/UPDATE_CANVAS/ERROR'),
  success: createAction<CadenceStep>('CADENCE_STEP_WIP/UPDATE_CANVAS/SUCCESS'),
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

export const changeCadenceStepInExitActions = {
  isLoading: createAction<boolean>(
    'CADENCE_STEP_WIP/CHANGE_IN_EXIT/IS_LOADING',
  ),
  error: createAction<Error | null>('CADENCE_STEP_WIP/CHANGE_IN_EXIT/ERROR'),
  success: createAction<UpdatedTriggersList>(
    'CADENCE_STEP_WIP/CHANGE_IN_EXIT/SUCCESS',
  ),
};

export function changeCadenceStepInExit(
  id: number,
  status: DestinationStatus,
  options?: OptionCallback<UpdatedTriggersList>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(changeCadenceStepInExitActions.isLoading(true));
    dispatch(changeCadenceStepInExitActions.error(null));

    try {
      const response = await changeCadenceStepInExitAPI(id, status);
      dispatch(changeCadenceStepInExitActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(changeCadenceStepInExitActions.error(err));
      options?.onError?.();
    }

    dispatch(changeCadenceStepInExitActions.isLoading(false));
  };
}

export const updateCadenceStepActions = {
  isLoading: createAction<boolean>('CADENCE_STEP_WIP/UPDATE/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP_WIP/UPDATE/ERROR'),
  success: createAction<CadenceStep>('CADENCE_STEP_WIP/UPDATE/SUCCESS'),
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
  isLoading: createAction<boolean>('CADENCE_STEP_WIP/DELETE/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP_WIP/DELETE/ERROR'),
  success: createAction<{ id: number }>('CADENCE_STEP_WIP/DELETE/SUCCESS'),
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
