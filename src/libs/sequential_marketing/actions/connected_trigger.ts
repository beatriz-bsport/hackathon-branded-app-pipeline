import { createAction } from 'redux-actions';
import type { OptionCallback, Dispatch } from '../../../state/types';

import {
  subscribeStepToStep as subscribeStepToStepAPI,
  updateCadenceStepConnectedTriggerCanvasPosition as updateCadenceStepConnectedTriggerCanvasPositionAPI,
  convertCadenceExitIntoStep as convertCadenceExitIntoStepAPI,
  updateConnectedTrigger as updateConnectedTriggerAPI,
  deleteConnectedTrigger as deleteConnectedTriggerAPI,
} from '#libs/sequential_marketing/api';

import type {
  CadenceStep,
  ConnectedTrigger,
  GraphCanvas,
  UpdatedTrigger,
} from '#libs/sequential_marketing/types';

export const subscribeStepToStepActions = {
  isLoading: createAction<boolean>('CADENCE_STEP_WIP/SUB_TO_STEP/IS_LOADING'),
  error: createAction<Error>('CADENCE_STEP_WIP/SUB_TO_STEP/ERROR'),
  success: createAction<{
    step: CadenceStep;
    connected_trigger: ConnectedTrigger;
  }>('CADENCE_STEP_WIP/SUB_TO_STEP/SUCCESS'),
};

export function subscribeStepToStep(
  cadenceId: number,
  data: {
    connected_trigger: ConnectedTrigger;
    step?: Pick<CadenceStep, 'id' | 'name' | 'canvas'>;
  },
  options?: OptionCallback<{
    step: CadenceStep;
    connected_trigger: ConnectedTrigger;
  }>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(subscribeStepToStepActions.isLoading(true));
    dispatch(subscribeStepToStepActions.error(null));

    try {
      const response = await subscribeStepToStepAPI(cadenceId, data);
      dispatch(subscribeStepToStepActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(subscribeStepToStepActions.error(err));
      options?.onError?.(err);
    }

    dispatch(subscribeStepToStepActions.isLoading(false));
  };
}

export const updateCadenceStepConnectedTriggerCanvasPositionActions = {
  isLoading: createAction<boolean>(
    'CADENCE_STEP_WIP/UPDATE_CT_CANVAS/IS_LOADING',
  ),
  error: createAction<Error>('CADENCE_STEP_WIP/UPDATE_CT_CANVAS/ERROR'),
  success: createAction<CadenceStep>(
    'CADENCE_STEP_WIP/UPDATE_CT_CANVAS/SUCCESS',
  ),
};

export function updateCadenceStepConnectedTriggerCanvasPosition(
  id: number,
  position: { ct_uuid: string; x: number; y: number },
  options?: OptionCallback<CadenceStep>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      updateCadenceStepConnectedTriggerCanvasPositionActions.isLoading(true),
    );
    dispatch(
      updateCadenceStepConnectedTriggerCanvasPositionActions.error(null),
    );

    try {
      const response = await updateCadenceStepConnectedTriggerCanvasPositionAPI(
        id,
        position,
      );
      dispatch(
        updateCadenceStepConnectedTriggerCanvasPositionActions.success(
          response.data,
        ),
      );
      options && options.onSuccess && options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(
        updateCadenceStepConnectedTriggerCanvasPositionActions.error(err),
      );
      options && options.onError && options.onError();
    }

    dispatch(
      updateCadenceStepConnectedTriggerCanvasPositionActions.isLoading(false),
    );
  };
}

export const convertCadenceExitIntoStepActions = {
  isLoading: createAction<boolean>(
    'CADENCE_STEP_WIP/CONVERT_INTO_STEP/IS_LOADING',
  ),
  error: createAction<Error | null>('CADENCE_STEP_WIP/CONVERT_INTO_STEP/ERROR'),
  success: createAction<{
    updatedTrigger: UpdatedTrigger;
    disabledTriggerUuid: string;
  }>('CADENCE_STEP_WIP/CONVERT_INTO_STEP/SUCCESS'),
};

export function convertCadenceExitIntoStep(
  cadenceId: number,
  triggerUuid: string,
  step: { name: string; canvas: GraphCanvas },
  options?: OptionCallback<UpdatedTrigger>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(convertCadenceExitIntoStepActions.isLoading(true));
    dispatch(convertCadenceExitIntoStepActions.error(null));

    try {
      const response = await convertCadenceExitIntoStepAPI(
        cadenceId,
        triggerUuid,
        step,
      );
      dispatch(
        convertCadenceExitIntoStepActions.success({
          updatedTrigger: response.data,
          disabledTriggerUuid: triggerUuid,
        }),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(convertCadenceExitIntoStepActions.error(err));
      options?.onError?.();
    }
    dispatch(convertCadenceExitIntoStepActions.isLoading(false));
  };
}

export const updateConnectedTriggerActions = {
  isLoading: createAction<boolean>('CONNECTED_TRIGGER_WIP/UPDATE/IS_LOADING'),
  error: createAction<Error>('CONNECTED_TRIGGER_WIP/UPDATE/ERROR'),
  success: createAction<{
    updatedConnectedTrigger: ConnectedTrigger;
    disabledUuid: string;
  }>('CONNECTED_TRIGGER_WIP/UPDATE/SUCCESS'),
};

export function updateConnectedTrigger(
  cadenceId: number,
  connectedTriggerUUID: string,
  connectedTrigger: ConnectedTrigger,
  options?: OptionCallback<ConnectedTrigger>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateConnectedTriggerActions.isLoading(true));
    dispatch(updateConnectedTriggerActions.error(null));

    try {
      const response = await updateConnectedTriggerAPI(
        cadenceId,
        connectedTriggerUUID,
        connectedTrigger,
      );
      dispatch(
        updateConnectedTriggerActions.success({
          updatedConnectedTrigger: response.data,
          disabledUuid: connectedTriggerUUID,
        }),
      );
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(updateConnectedTriggerActions.error(err));
      options?.onError?.();
    }

    dispatch(updateConnectedTriggerActions.isLoading(false));
  };
}

export const deleteConnectedTriggerActions = {
  isLoading: createAction<boolean>('CONNECTED_TRIGGER_WIP/DELETE/IS_LOADING'),
  error: createAction<Error>('CONNECTED_TRIGGER_WIP/DELETE/ERROR'),
  success: createAction<{ source_id: number; connected_trigger_uuid: string }>(
    'CONNECTED_TRIGGER_WIP/DELETE/SUCCESS',
  ),
};

export function deleteConnectedTrigger(
  cadenceId: number,
  connectedTriggerUUID: string,
  sourceStepId: number,
  options?: OptionCallback<void>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteConnectedTriggerActions.isLoading(true));
    dispatch(deleteConnectedTriggerActions.error(null));

    try {
      await deleteConnectedTriggerAPI(cadenceId, connectedTriggerUUID);
      dispatch(
        deleteConnectedTriggerActions.success({
          connected_trigger_uuid: connectedTriggerUUID,
          source_id: sourceStepId,
        }),
      );
      options && options.onSuccess && options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(deleteConnectedTriggerActions.error(err));
      options && options.onError && options.onError();
    }

    dispatch(deleteConnectedTriggerActions.isLoading(false));
  };
}
