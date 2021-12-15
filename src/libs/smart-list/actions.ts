// tests back
// validation front
// page DETAIL

// liste deroulante a afficher quand ajout filter
import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import { snackbarSuccess, snackbarError } from '../snackbar/actions';

import withIntercomAction from '../../hocs/tracking/dispatch-action.hoc';

import { getFreshSmartListIds } from './selectors';
import {
  fetchSmartListList as fetchSmartListListAPI,
  fetchSmartListDetail as fetchSmartListDetailAPI,
  fetchSmartListFilters as fetchSmartListFiltersAPI,
  createSmartList as createSmartListAPI,
  updateSmartList as updateSmartListAPI,
  deleteSmartList as deleteSmartListAPI,
  createFilter as createFilterAPI,
  deleteFilter as deleteFilterAPI,
  updateFilter as updateFilterAPI,
  copySmartList as copySmartListAPI,
  fetchSmartListAutoTagRules as fetchSmartListAutoTagRulesAPI,
  createSmartListTagRules as createSmartListTagRulesAPI,
  updateSmartListAutoTagRules as updateSmartListAutoTagRulesAPI,
  deleteSmartListAutoTagRules as deleteSmartListAutoTagRulesAPI,
  applySmartListAutoTagRules as applySmartListAutoTagRulesAPI,
  applyAsyncSmartListAutoTagRules as applyAsyncSmartListAutoTagRulesAPI,
  deleteMultiSmartListAutoTagRules as deleteMultiSmartListAutoTagRulesAPI,
} from './api';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

import { createDictionnaryById, createIdList } from '../../actions/utils';
import { SmartList } from './types';
import { RootState } from '../../reducers';
import { monitorBackgroundTask } from '../background-task/actions';

export const smartListListAction = {
  error: createAction('SMART-LIST/LIST/ERROR'),
  isLoading: createAction('SMART-LIST/LIST/IS_LOADING'),
  success: createAction('SMART-LIST/LIST/SUCCESS'),
};

export function fetchAllSmartLists(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(smartListListAction.isLoading(true));
    dispatch(smartListListAction.error(null));

    try {
      const response = await fetchSmartListListAPI();
      dispatch(
        smartListListAction.success({
          smartListDict: createDictionnaryById(response.data),
          smartListIdList: createIdList(response.data),
        }),
      );
      dispatch(smartListListAction.error(null));
    } catch (error) {
      dispatch(smartListListAction.error(error));
    }
    dispatch(smartListListAction.isLoading(false));
  };
}

export const smartListFilterAction = {
  error: createAction('SMART-LIST/LIST-FILTER/ERROR'),
  isLoading: createAction('SMART-LIST/LIST-FILTER/IS_LOADING'),
  success: createAction('SMART-LIST/LIST-FILTER/SUCCESS'),
};

export function fetchSmartLists(params: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(smartListFilterAction.isLoading(true));
    dispatch(smartListFilterAction.error(null));
    try {
      const res = await fetchSmartListListAPI(params);
      dispatch(smartListFilterAction.success(res.data));
      if (options && options.onSuccess) options.onSuccess(res.data);
    } catch (err) {
      dispatch(smartListFilterAction.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(smartListFilterAction.isLoading(false));
  };
}

export const smartListBulkAction = {
  error: createAction('SMART-LIST/BULK_RETRIEVE/ERROR'),
  isLoading: createAction('SMART-LIST/BULK_RETRIEVE/IS_LOADING'),
  success: createAction('SMART-LIST/BULK_RETRIEVE/SUCCESS'),
};

export function fetchSmartListBulk(ids: Array<number>): ThunkAction {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const freshSmartlistList = getFreshSmartListIds(getState());
    const ids_uniq = uniq(ids.filter((id) => !!id)).filter(
      (id) => !freshSmartlistList.includes(id),
    );
    if (ids_uniq.length === 0) {
      return;
    }
    dispatch(smartListBulkAction.isLoading(true));
    dispatch(smartListBulkAction.error(null));

    try {
      const response = await fetchSmartListListAPI({ id__in: ids_uniq });
      dispatch(
        smartListBulkAction.success({
          smartListDict: createDictionnaryById(response.data),
          smartListIdList: createIdList(response.data),
        }),
      );
      dispatch(smartListBulkAction.error(null));
    } catch (error) {
      dispatch(smartListBulkAction.error(error));
    }
    dispatch(smartListBulkAction.isLoading(false));
  };
}

export const smartListDetailAction = {
  error: createAction('SMART-LIST/DETAIL/ERROR'),
  isLoading: createAction('SMART-LIST/DETAIL/IS_LOADING'),
  success: createAction('SMART-LIST/DETAIL/SUCCESS'),
};

export function fetchSmartListDetail(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(smartListDetailAction.isLoading(true));
    dispatch(smartListDetailAction.error(null));

    try {
      const response = await fetchSmartListDetailAPI(id);
      dispatch(smartListDetailAction.success({ [id]: response.data }));
      dispatch(smartListDetailAction.error(null));
    } catch (error) {
      dispatch(smartListDetailAction.error(error));
    }
    dispatch(smartListDetailAction.isLoading(false));
  };
}

export const smartListCopyAction = {
  error: createAction('SMART-LIST/COPY/ERROR'),
  isLoading: createAction('SMART-LIST/COPY/IS_LOADING'),
  success: createAction('SMART-LIST/COPY/SUCCESS'),
};

export function copySmartList(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(smartListCopyAction.isLoading(true));
    dispatch(smartListCopyAction.error(null));

    try {
      const response = await copySmartListAPI(id);
      dispatch(smartListCopyAction.success(response.data));
      dispatch(snackbarSuccess('smartlist.duplicate.success'));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.id);
      }
      dispatch(smartListCopyAction.error(null));
    } catch (error) {
      dispatch(smartListCopyAction.error(error));
    }
    dispatch(smartListCopyAction.isLoading(false));
  };
}

export const createSmartListAction = {
  error: createAction('SMART-LIST/CREATE/ERROR'),
  isLoading: createAction('SMART-LIST/CREATE/IS_LOADING'),
  success: withIntercomAction('Create Smartlist')(
    createAction('SMART-LIST/CREATE/SUCCESS'),
  ),
};

export function smartListCreate(
  data: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createSmartListAction.isLoading(true));
    dispatch(createSmartListAction.error(null));

    try {
      const response = await createSmartListAPI(data);
      dispatch(createSmartListAction.success(response.data));
      dispatch(createSmartListAction.error(null));
      dispatch(snackbarSuccess('smartlist.create.success'));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(createSmartListAction.error(error));
      dispatch(snackbarError('smartlist.create.error'));
      if (options && options.onError) options.onError(error);
    }
    dispatch(createSmartListAction.isLoading(false));
  };
}

export const updateSmartListAction = {
  error: createAction('SMART-LIST/UPDATE/ERROR'),
  isLoading: createAction('SMART-LIST/UPDATE/IS_LOADING'),
  success: createAction('SMART-LIST/UPDATE/SUCCESS'),
};

export function smartListUpdate(
  id: number,
  data: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateSmartListAction.isLoading(true));
    dispatch(updateSmartListAction.error(null));

    try {
      const response = await updateSmartListAPI(id, data);
      dispatch(updateSmartListAction.success(response.data));
      dispatch(updateSmartListAction.error(null));
      dispatch(snackbarSuccess('smartlist.update.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(updateSmartListAction.error(error));
      dispatch(snackbarError('smartlist.udpate.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(updateSmartListAction.isLoading(false));
  };
}

export const deleteSmartListAction = {
  error: createAction('SMART-LIST/DELETE/ERROR'),
  isLoading: createAction('SMART-LIST/DELETE/IS_LOADING'),
  success: createAction('SMART-LIST/DELETE/SUCCESS'),
};

export function smartListDelete(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteSmartListAction.isLoading(true));
    dispatch(deleteSmartListAction.error(null));

    try {
      await deleteSmartListAPI(id);

      dispatch(snackbarSuccess('smartlist.delete.success'));
      dispatch(deleteSmartListAction.success(id));
    } catch (error) {
      dispatch(deleteSmartListAction.error(error));
      dispatch(snackbarError('smartlist.delete.error'));
    }
    dispatch(deleteSmartListAction.isLoading(false));
  };
}

export const fetchSmartListFiltersAction = {
  error: createAction('SMART-LIST/FILTERS/LIST/ERROR'),
  isLoading: createAction('SMART-LIST/FILTERS/LIST/IS_LOADING'),
  success: createAction('SMART-LIST/FILTERS/LIST/SUCCESS'),
};

export function fetchSmartListFilters(smartListId: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchSmartListFiltersAction.isLoading(true));
    dispatch(fetchSmartListFiltersAction.error(null));
    try {
      const response = await fetchSmartListFiltersAPI(smartListId);
      dispatch(fetchSmartListFiltersAction.success(response.data));
    } catch (error) {
      dispatch(fetchSmartListFiltersAction.error(error));
    }
    dispatch(fetchSmartListFiltersAction.isLoading(false));
  };
}

export const filterCreateAction = {
  error: createAction('SMART-LIST/FILTERS/CREATE/ERROR'),
  isLoading: createAction('SMART-LIST/FILTERS/CREATE/IS_LOADING'),
  success: createAction('SMART-LIST/FILTERS/CREATE/SUCCESS'),
};

export function createFilter(
  filter_identifier: number,
  data: any,
  smartListId: number,
  options: OptionCallback & { callback?: (id: number) => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(filterCreateAction.isLoading(true));
    dispatch(filterCreateAction.error(null));
    try {
      const response = await createFilterAPI(filter_identifier, data);
      if (options && options.callback) options.callback(smartListId);
      if (options && options.onSuccess) options.onSuccess();
      const filterData = response.data;
      filterData.filter_identifier = filter_identifier;
      dispatch(
        filterCreateAction.success({
          filter_identifier,
          filter: filterData,
          smartListId,
        }),
      );
    } catch (error) {
      dispatch(filterCreateAction.error(error));
    }
    dispatch(filterCreateAction.isLoading(false));
  };
}

export const filterUpdateAction = {
  error: createAction('SMART-LIST/FILTERS/UPDATE/ERROR'),
  isLoading: createAction('SMART-LIST/FILTERS/UPDATE/IS_LOADING'),
  success: createAction('SMART-LIST/FILTERS/UPDATE/SUCCESS'),
};

export function updateFilter(
  smartListId: number,
  filter_identifier: number,
  id: number,
  data: any,
  options: OptionCallback & { callback?: (id: number) => void },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(filterUpdateAction.isLoading(true));
    dispatch(filterUpdateAction.error(null));
    try {
      const response = await updateFilterAPI(filter_identifier, id, data);
      if (options && options.callback) options.callback(smartListId);
      if (options && options.onSuccess) options.onSuccess();
      dispatch(
        filterUpdateAction.success({
          smartListId,
          filter_identifier,
          id,
          filter: response.data,
        }),
      );
    } catch (error) {
      dispatch(filterUpdateAction.error(error));
    }
    dispatch(filterUpdateAction.isLoading(false));
  };
}

export const filterDeleteAction = {
  error: createAction('SMART-LIST/FILTERS/DELETE/ERROR'),
  isLoading: createAction('SMART-LIST/FILTERS/DELETE/IS_LOADING'),
  success: createAction('SMART-LIST/FILTERS/DELETE/SUCCESS'),
};

export function deleteFilter(
  filter_identifier: number,
  id: number,
  smartListId: number,
  callback?: (id: number) => void,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(filterDeleteAction.isLoading(true));
    dispatch(filterDeleteAction.error(null));
    try {
      await deleteFilterAPI(filter_identifier, id);
      callback(smartListId);
      dispatch(
        filterDeleteAction.success({ smartListId, filter_identifier, id }),
      );
    } catch (error) {
      dispatch(filterDeleteAction.error(error));
    }
    dispatch(filterDeleteAction.isLoading(false));
  };
}

export const smartListAutoTagListActions = {
  error: createAction('SMARTLIST/AUTO-TAG/LIST/ERROR'),
  isLoading: createAction('SMARTLIST/AUTO-TAG/LIST/LOADING'),
  success: createAction('SMARTLIST/AUTO-TAG/LIST/SUCCESS'),
};

export function fetchAutoTagRules(params?: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(smartListAutoTagListActions.isLoading(true));
    dispatch(smartListAutoTagListActions.error(null));
    try {
      const response = await fetchSmartListAutoTagRulesAPI(params);
      dispatch(smartListAutoTagListActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(smartListAutoTagListActions.error(err));
    }
    dispatch(smartListAutoTagListActions.isLoading(false));
  };
}

export const createSmartListAutoTagActions = {
  error: createAction('SMART-LIST/AUTO-TAG/CREATE/ERROR'),
  isLoading: createAction('SMART-LIST/AUTO-TAG/CREATE/IS_LOADING'),
  success: createAction('SMARTLIST/AUTO-TAG/CREATE/SUCCESS'),
};

export function smartLitAutTagCreate(
  data: any,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createSmartListAutoTagActions.isLoading(true));
    dispatch(createSmartListAutoTagActions.error(null));

    try {
      const response = await createSmartListTagRulesAPI(data);
      dispatch(createSmartListAutoTagActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(createSmartListAutoTagActions.error(error));
      if (
        error.response.data &&
        error.response.data.msg === 'limit_of_ten_rules_reached'
      ) {
        dispatch(snackbarError('smartlist.tag_rules.limit_reached'));
      }
    }
    dispatch(createSmartListAutoTagActions.isLoading(false));
  };
}

export const updateSmartListAutoTagActions = {
  error: createAction('SMART-LIST/AUTO-TAG/UPDATE/ERROR'),
  isLoading: createAction('SMART-LIST/AUTO-TAG/UPDATE/IS_LOADING'),
  success: createAction('SMARTLIST/AUTO-TAG/UPDATE/SUCCESS'),
};

export function updateSmartListAutoTag(
  id: number,
  params: any,
  options: OptionCallback<SmartList[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    let data = null;
    dispatch(updateSmartListAutoTagActions.isLoading(true));
    dispatch(updateSmartListAutoTagActions.error(null));
    try {
      const response = await updateSmartListAutoTagRulesAPI(id, params);
      data = response.data;
      dispatch(updateSmartListAutoTagActions.success(data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(updateSmartListAutoTagActions.error(err));
    }
    dispatch(updateSmartListAutoTagActions.isLoading(false));
    return data;
  };
}

export const deleteSmartListAutoTagAction = {
  error: createAction('SMART-LIST/AUTO-TAG/DELETE/ERROR'),
  isLoading: createAction('SMART-LIST/AUTO-TAG/DELETE/IS_LOADING'),
  success: createAction('SMARTLIST/AUTO-TAG/DELETE/SUCCESS'),
};

export function smartListAutoTagDelete(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteSmartListAutoTagAction.isLoading(true));
    dispatch(deleteSmartListAutoTagAction.error(null));
    try {
      await deleteSmartListAutoTagRulesAPI(id);
      dispatch(deleteSmartListAutoTagAction.success(id));
    } catch (error) {
      dispatch(deleteSmartListAutoTagAction.error(error));
    }
    dispatch(deleteSmartListAutoTagAction.isLoading(false));
  };
}

export const deleteMultipleSmartListAutoTagAction = {
  error: createAction('SMART-LIST/AUTO-TAG/DELETE-MULTIPLE/ERROR'),
  isLoading: createAction('SMART-LIST/AUTO-TAG/DELETE-MULTIPLE/IS_LOADING'),
  success: createAction('SMARTLIST/AUTO-TAG/DELETE-MULTIPLE/SUCCESS'),
};

export function deleteMultiSmartListAutoTagRules(
  smartlist: number,
  tag: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteMultipleSmartListAutoTagAction.isLoading(true));
    dispatch(deleteMultipleSmartListAutoTagAction.error(null));
    try {
      await deleteMultiSmartListAutoTagRulesAPI(smartlist, tag);
      dispatch(
        deleteMultipleSmartListAutoTagAction.success({ smartlist, tag }),
      );
    } catch (error) {
      dispatch(deleteMultipleSmartListAutoTagAction.error(error));
    }
    dispatch(deleteMultipleSmartListAutoTagAction.isLoading(false));
  };
}

export const applySmartListAutotagRulesAction = {
  error: createAction('SMART-LIST/AUTO-TAG/APPLY/ERROR'),
  isLoading: createAction('SMART-LIST/AUTO-TAG/APPLY/IS_LOADING'),
  success: createAction('SMARTLIST/AUTO-TAG/APPLY/SUCCESS'),
};

export function applySmartListAutoTagRules(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(applySmartListAutotagRulesAction.isLoading(true));
    dispatch(applySmartListAutotagRulesAction.error(null));
    try {
      const response = await applySmartListAutoTagRulesAPI(id);
      dispatch(applySmartListAutotagRulesAction.success(response));
      dispatch(snackbarSuccess('smartlist.tag_rules.success'));
    } catch (err) {
      dispatch(applySmartListAutotagRulesAction.error(err));
      dispatch(snackbarError('smartlist.tag_rules.error'));
    }
    dispatch(applySmartListAutotagRulesAction.isLoading(false));
  };
}

export const applyAsyncSmartListAutoTagRulesActions = {
  error: createAction('SMART-LIST/AUTO-TAG/APPLY_ASYNC/ERROR'),
  isLoading: createAction('SMART-LIST/AUTO-TAG/APPLY_ASYNC/IS_LOADING'),
  success: createAction('SMARTLIST/AUTO-TAG/APPLY_ASYNC/SUCCESS'),
};

export function applyAsyncSmartListAutoTagRules(
  id: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(applyAsyncSmartListAutoTagRulesActions.isLoading(true));
    dispatch(applyAsyncSmartListAutoTagRulesActions.error(null));
    try {
      const response = await applyAsyncSmartListAutoTagRulesAPI(id);
      dispatch(applyAsyncSmartListAutoTagRulesActions.success(response));
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
          },
        }),
      );
    } catch (err) {
      dispatch(applyAsyncSmartListAutoTagRulesActions.error(err));
      if (options && options.onError) options.onError();
      dispatch(snackbarError('smartlist.tag_rules.error'));
    }
    dispatch(applyAsyncSmartListAutoTagRulesActions.isLoading(false));
  };
}
