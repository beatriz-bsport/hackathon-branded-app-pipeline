import { createAction } from 'redux-actions';

import {
  fetchMarketingActions as fetchMarketingActionsAPI,
  createStepMarketingAction as createStepMarketingActionAPI,
  updateStepMarketingAction as updateStepMarketingActionAPI,
  modifyStepMarketingActionsConfiguration as modifyStepMarketingActionsConfigurationAPI,
  deleteStepMarketingAction as deleteStepMarketingActionAPI,
} from '#libs/sequential_marketing/api';

import type {
  StepMarketingActionsParams,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';
import type {
  OptionCallback,
  Dispatch,
  OptionPaginatedCallback,
  PaginatedResponse,
} from '../../../state/types';

export const fetchStepMarketingActions = {
  isLoading: createAction<boolean>('CADENCE_WIP/MARKETING_ACTIONS/IS_LOADING'),
  error: createAction<Error>('CADENCE_WIP/MARKETING_ACTIONS/ERROR'),
  success: createAction<PaginatedResponse<StepMarketingActions>>(
    'CADENCE_WIP/MARKETING_ACTIONS/SUCCESS',
  ),
};

export function fetchMarketingActions(
  params?: StepMarketingActionsParams,
  options?: OptionPaginatedCallback<StepMarketingActions>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchStepMarketingActions.isLoading(true));
    dispatch(fetchStepMarketingActions.error(null));

    try {
      const response = await fetchMarketingActionsAPI(params);
      dispatch(fetchStepMarketingActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchStepMarketingActions.error(err));
      options?.onError?.();
    }

    dispatch(fetchStepMarketingActions.isLoading(false));
  };
}

export const upsertStepMarketingActionsActions = {
  isLoading: createAction<boolean>(
    'CADENCE_WIP/MARKETING_ACTIONS/UPSERT/IS_LOADING',
  ),
  error: createAction<Error>('CADENCE_WIP/MARKETING_ACTIONS/UPSERT/ERROR'),
  success: createAction<StepMarketingActions>(
    'CADENCE_WIP/MARKETING_ACTIONS/UPSERT/SUCCESS',
  ),
};

export function upsertStepMarketingAction(
  data: Partial<StepMarketingActions>,
  options?: OptionCallback<StepMarketingActions>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(upsertStepMarketingActionsActions.isLoading(true));
    dispatch(upsertStepMarketingActionsActions.error(null));

    try {
      if (data?.id) {
        const response = await updateStepMarketingActionAPI(data.id, data);
        dispatch(upsertStepMarketingActionsActions.success(response.data));
        options?.onSuccess?.(response.data);
      } else {
        const response = await createStepMarketingActionAPI(data);
        dispatch(upsertStepMarketingActionsActions.success(response.data));
        options?.onSuccess?.(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(upsertStepMarketingActionsActions.error(err));
      options?.onError?.(err);
    }

    dispatch(upsertStepMarketingActionsActions.isLoading(false));
  };
}

export const modifyStepMarketingActionsConfigurationActions = {
  isLoading: createAction<boolean>(
    'CADENCE_WIP/MARKETING_ACTIONS/UPDATE_ALL_CONFIGURATION/IS_LOADING',
  ),
  error: createAction<Error>(
    'CADENCE_WIP/MARKETING_ACTIONS/UPDATE_ALL_CONFIGURATION/ERROR',
  ),
  success: createAction<{
    result: StepMarketingActions[];
    disabled: number[];
  }>('CADENCE_WIP/MARKETING_ACTIONS/UPDATE_ALL_CONFIGURATION/SUCCESS'),
};

export function modifyStepMarketingActionsConfiguration(
  data: { list: StepMarketingActions[]; stepId: number },
  options?: OptionCallback<StepMarketingActions[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(modifyStepMarketingActionsConfigurationActions.isLoading(true));
    dispatch(modifyStepMarketingActionsConfigurationActions.error(null));

    try {
      const response = await modifyStepMarketingActionsConfigurationAPI(
        data.stepId,
        data.list,
      );
      dispatch(
        modifyStepMarketingActionsConfigurationActions.success(response.data),
      );
      options?.onSuccess?.(response.data.result);
    } catch (err) {
      console.error(err);
      dispatch(modifyStepMarketingActionsConfigurationActions.error(err));
      options?.onError?.(err);
    }

    dispatch(modifyStepMarketingActionsConfigurationActions.isLoading(false));
  };
}

export const deleteStepMarketingActionsActions = {
  isLoading: createAction<boolean>(
    'CADENCE_WIP/MARKETING_ACTIONS/DELETE/IS_LOADING',
  ),
  error: createAction<Error>('CADENCE_WIP/MARKETING_ACTIONS/DELETE/ERROR'),
  success: createAction<{ id: number; stepId: number }>(
    'CADENCE_WIP/MARKETING_ACTIONS/DELETE/SUCCESS',
  ),
};

export function deleteStepMarketingAction(
  data: { id: number; stepId: number },
  options?: OptionCallback<StepMarketingActions>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteStepMarketingActionsActions.isLoading(true));
    dispatch(deleteStepMarketingActionsActions.error(null));

    try {
      await deleteStepMarketingActionAPI(data.id);
      dispatch(deleteStepMarketingActionsActions.success(data));
      options?.onSuccess?.();
    } catch (err) {
      console.error(err);
      dispatch(deleteStepMarketingActionsActions.error(err));
      options?.onError?.();
    }

    dispatch(deleteStepMarketingActionsActions.isLoading(false));
  };
}
