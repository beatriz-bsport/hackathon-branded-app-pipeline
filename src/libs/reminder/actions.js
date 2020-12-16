// @flow

import { createAction } from 'redux-actions';

import {
  fetchTaskList as fetchTaskListAPI,
  createOrUpdateTask as createOrUpdateTaskAPI,
  patchTask as patchTaskAPI,
} from './api';
import type { Dispatch, OptionCallback } from '../../state/types.ts';
import { fetchAll as fetchAlerting } from '../alerting/actions';

export const listTaskByMemberActions = {
  error: createAction('REMINDER/TASK_BY_MEMBER/ERROR'),
  isLoading: createAction('REMINDER/TASK_BY_MEMBER/LOADING'),
  success: createAction('REMINDER/TASK_BY_MEMBER/SUCCESS'),
};

export function fetchTaskListByMember(
  member: number,
  page: number = 1,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(listTaskByMemberActions.isLoading(true));
    dispatch(listTaskByMemberActions.error(null));

    try {
      const response = await fetchTaskListAPI({ member, page });
      dispatch(listTaskByMemberActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(listTaskByMemberActions.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(listTaskByMemberActions.isLoading(false));
  };
}

export const createOrUpdateActions = {
  error: createAction('REMINDER/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('REMINDER/CREATE_OR_UPDATE/LOADING'),
  success: createAction('REMINDER/CREATE_OR_UPDATE/SUCCESS'),
};

export function createOrUpdateTask(data: any, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(createOrUpdateActions.isLoading(true));
    dispatch(createOrUpdateActions.error(null));

    try {
      const response = await createOrUpdateTaskAPI(data);
      dispatch(createOrUpdateActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(fetchAlerting());
    } catch (error) {
      dispatch(createOrUpdateActions.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(createOrUpdateActions.isLoading(false));
  };
}

export const updateStatusAction = {
  error: createAction('REMINDER/STATUS/ERROR'),
  isLoading: createAction('REMINDER/STATUS/LOADING'),
  success: createAction('REMINDER/STATUS/SUCCESS'),
};

export function updateTaskStatus(
  id: number,
  status: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateStatusAction.isLoading(true));
    dispatch(updateStatusAction.error(null));

    try {
      const response = await patchTaskAPI(id, { status });
      dispatch(updateStatusAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
      dispatch(fetchAlerting());
    } catch (error) {
      dispatch(updateStatusAction.error(error));
      if (options && options.onError) options.onError(error);
    }

    dispatch(updateStatusAction.isLoading(false));
  };
}
