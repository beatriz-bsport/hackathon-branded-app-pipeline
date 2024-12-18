import { createAction } from 'redux-actions';

import {
  retrieveCadenceStep as retrieveCadenceStepAPI,
  fetchCadenceStepList as fetchCadenceStepListAPI,
  updateCadenceStepCanvasPosition as updateCadenceStepCanvasPositionAPI,
  convertCadenceStepIntoExit as convertCadenceStepIntoExitAPI,
  updateCadenceStepName as updateCadenceStepNameAPI,
  deleteCadenceStep as deleteCadenceStepAPI,
  fetchCadenceStepMemberIds as fetchCadenceStepMemberIdsAPI,
} from '#src/libs/sequential_marketing/api';
import { DestinationStatus } from '#src/libs/sequential_marketing/constants';

import type {
  CadenceStep,
  CadenceStepQueryParams,
  UpdatedTriggersList,
} from '#src/libs/sequential_marketing/types';
import type {
  OptionCallback,
  Dispatch,
  OptionPaginatedCallback,
  PaginatedResponse,
} from '../../../state/types';

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
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(retrieveCadenceStepActions.error(err));
      options?.onError?.();
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
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchCadenceStepListActions.error(err));
      options?.onError?.();
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
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateCadenceStepCanvasPositionActions.error(err));
      options?.onError?.();
    }

    dispatch(updateCadenceStepCanvasPositionActions.isLoading(false));
  };
}

export const convertCadenceStepIntoExitActions = {
  isLoading: createAction<boolean>(
    'CADENCE_STEP_WIP/CONVERT_INTO_EXIT/IS_LOADING',
  ),
  error: createAction<Error | null>('CADENCE_STEP_WIP/CONVERT_INTO_EXIT/ERROR'),
  success: createAction<UpdatedTriggersList>(
    'CADENCE_STEP_WIP/CONVERT_INTO_EXIT/SUCCESS',
  ),
};

export function convertCadenceStepIntoExit(
  id: number,
  status: DestinationStatus,
  options?: OptionCallback<UpdatedTriggersList>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(convertCadenceStepIntoExitActions.isLoading(true));
    dispatch(convertCadenceStepIntoExitActions.error(null));

    try {
      const response = await convertCadenceStepIntoExitAPI(id, status);
      dispatch(convertCadenceStepIntoExitActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(convertCadenceStepIntoExitActions.error(err));
      options?.onError?.();
    }

    dispatch(convertCadenceStepIntoExitActions.isLoading(false));
  };
}

export const updateCadenceStepNameActions = {
  isLoading: createAction<boolean>('CADENCE_STEP_WIP/UPDATE/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP_WIP/UPDATE/ERROR'),
  success: createAction<CadenceStep>('CADENCE_STEP_WIP/UPDATE/SUCCESS'),
};

export function updateCadenceStepName(
  id: number,
  name: string,
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateCadenceStepNameActions.isLoading(true));
    dispatch(updateCadenceStepNameActions.error(null));

    try {
      const response = await updateCadenceStepNameAPI(id, name);
      dispatch(updateCadenceStepNameActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateCadenceStepNameActions.error(err));
      options?.onError?.();
    }

    dispatch(updateCadenceStepNameActions.isLoading(false));
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
      options?.onSuccess?.();
    } catch (err) {
      console.error(err);
      dispatch(deleteCadenceStepActions.error(err));
      options?.onError?.();
    }

    dispatch(deleteCadenceStepActions.isLoading(false));
  };
}

export const fetchCadenceStepMemberIdsActions = {
  isLoading: createAction<boolean>('CADENCE_STEP/MEMBER_IDS_LIST/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP/MEMBER_IDS_LIST/ERROR'),
  success: createAction<{ [id: number]: number[] }>(
    'CADENCE_STEP/MEMBER_IDS_LIST/SUCCESS',
  ),
};

export function fetchCadenceStepMemberIds(
  cadenceId: number,
  options?: OptionCallback<{ [id: number]: number[] }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCadenceStepMemberIdsActions.isLoading(true));
    dispatch(fetchCadenceStepMemberIdsActions.error(null));

    try {
      const response = await fetchCadenceStepMemberIdsAPI(cadenceId);
      dispatch(fetchCadenceStepMemberIdsActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchCadenceStepMemberIdsActions.error(err));
      options?.onError?.();
    }

    dispatch(fetchCadenceStepMemberIdsActions.isLoading(false));
  };
}
