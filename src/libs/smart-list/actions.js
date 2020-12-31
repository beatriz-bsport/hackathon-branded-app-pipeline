// @flow

// tests back
// validation front
// page DETAIL

// liste deroulante a afficher quand ajout filter
import { createAction } from 'redux-actions';
import uniq from 'lodash/uniq';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

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
} from './api';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

import { createDictionnaryById, createIdList } from '../../actions/utils';

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

export const smartListBulkAction = {
  error: createAction('SMART-LIST/BULK_RETRIEVE/ERROR'),
  isLoading: createAction('SMART-LIST/BULK_RETRIEVE/IS_LOADING'),
  success: createAction('SMART-LIST/BULK_RETRIEVE/SUCCESS'),
};

export function fetchSmartListBulk(ids: Array<number>): ThunkAction {
  return async (dispatch: Dispatch, getState: () => State) => {
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
    dispatch(createSmartListAction.isLoading(true));
    dispatch(createSmartListAction.error(null));

    try {
      const response = await copySmartListAPI(id);
      dispatch(createSmartListAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.id);
      }
      dispatch(createSmartListAction.error(null));
    } catch (error) {
      dispatch(createSmartListAction.error(error));
    }
    dispatch(createSmartListAction.isLoading(false));
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

export function smartListUpdate(id: number, data: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateSmartListAction.isLoading(true));
    dispatch(updateSmartListAction.error(null));

    try {
      const response = await updateSmartListAPI(id, data);
      dispatch(updateSmartListAction.success(response.data));
      dispatch(updateSmartListAction.error(null));
      dispatch(snackbarSuccess('smartlist.update.success'));
    } catch (error) {
      dispatch(updateSmartListAction.error(error));
      dispatch(snackbarError('smartlist.udpate.error'));
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
  callback: ?(id) => void,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(filterCreateAction.isLoading(true));
    dispatch(filterCreateAction.error(null));
    try {
      const response = await createFilterAPI(filter_identifier, data);
      callback(smartListId);
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
  callback: ?(id) => void,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(filterUpdateAction.isLoading(true));
    dispatch(filterUpdateAction.error(null));
    try {
      const response = await updateFilterAPI(filter_identifier, id, data);
      callback(smartListId);
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
  callback: ?(id) => void,
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
