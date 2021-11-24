import { createAction } from 'redux-actions';

import api from './api';

import { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

export const tagListActions = {
  error: createAction('TAG/LIST/ERROR'),
  isLoading: createAction('TAG/LIST/IS_LOADING'),
  success: createAction('TAG/LIST/SUCCESS'),
};

export const tagGroupListActions = {
  error: createAction('TAG_GROUP/LIST/ERROR'),
  isLoading: createAction('TAG_GROUP/LIST/IS_LOADING'),
  success: createAction('TAG_GROUP/LIST/SUCCESS'),
};

export const tagGroupCreateOrUpdateActions = {
  error: createAction('TAG_GROUP/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('TAG_GROUP/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('TAG_GROUP/CREATE_OR_UPDATE/SUCCESS'),
};

export const tagCreateOrUpdateActions = {
  error: createAction('TAG/CREATE_OR_UPDATE/ERROR'),
  isLoading: createAction('TAG/CREATE_OR_UPDATE/IS_LOADING'),
  success: createAction('TAG/CREATE_OR_UPDATE/SUCCESS'),
};

export function fetchTags(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAllGroups());
    dispatch(fetchAllTags());
  };
}

export function fetchAllGroups(options?: OptionCallback): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(tagGroupListActions.isLoading(true));
    dispatch(tagGroupListActions.error(null));

    try {
      const response = await api.fetchAllGroups();
      dispatch(tagGroupListActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(tagGroupListActions.error(error));
      if (options && options.onError) {
        options.onSuccess(error);
      }
    }

    dispatch(tagGroupListActions.isLoading(false));
  };
}

export function fetchAllTags(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(tagListActions.isLoading(true));
    dispatch(tagListActions.error(null));

    try {
      const response = await api.fetchAllTags();
      dispatch(tagListActions.success(response.data));
    } catch (error) {
      dispatch(tagListActions.error(error));
    }

    dispatch(tagListActions.isLoading(false));
  };
}

export const tagUsageActions = {
  error: createAction('TAG/USAGE/ERROR'),
  isLoading: createAction('TAG/USAGE/IS_LOADING'),
  success: createAction('TAG/USAGE/SUCCESS'),
};

export function fetchTagUsage(): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(tagUsageActions.isLoading(true));
    dispatch(tagUsageActions.error(null));

    try {
      const response = await api.fetchTagUsage();
      dispatch(tagUsageActions.success(response.data));
    } catch (error) {
      dispatch(tagUsageActions.error(error));
    }

    dispatch(tagUsageActions.isLoading(false));
  };
}

export function createOrUpdateTag(
  data: any,
  callback?: (tagId: number) => void,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(tagCreateOrUpdateActions.isLoading(true));
    dispatch(tagCreateOrUpdateActions.error(null));
    const apiCall = data.id ? api.updateTag : api.createTag;
    try {
      const response = await apiCall(data);
      dispatch(tagCreateOrUpdateActions.success(response.data));
      if (typeof callback === 'function') {
        callback(response.data.id);
      }
    } catch (error) {
      dispatch(tagCreateOrUpdateActions.error(error));
    }
    dispatch(tagCreateOrUpdateActions.isLoading(false));
  };
}

export function createOrUpdateTagGroup(
  data: any,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(tagGroupCreateOrUpdateActions.isLoading(true));
    dispatch(tagGroupCreateOrUpdateActions.error(null));
    const apiCall = data.id ? api.updateTagGroup : api.createTagGroup;
    try {
      const response = await apiCall(data);
      dispatch(tagGroupCreateOrUpdateActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(tagGroupCreateOrUpdateActions.error(error));
    }
    dispatch(tagGroupCreateOrUpdateActions.isLoading(false));
  };
}

export function deleteTagGroup(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(tagGroupCreateOrUpdateActions.isLoading(true));
    dispatch(tagGroupCreateOrUpdateActions.error(null));

    try {
      await api.deleteTagGroup(id);
      dispatch(fetchAllGroups());
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(tagGroupCreateOrUpdateActions.error(error));
      if (options && options.onError) {
        options.onError();
      }
    }
    dispatch(tagGroupCreateOrUpdateActions.isLoading(false));
  };
}

export function deleteTag(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(tagCreateOrUpdateActions.isLoading(true));
    dispatch(tagCreateOrUpdateActions.error(null));

    try {
      await api.deleteTag(id);
      dispatch(fetchAllTags());
    } catch (error) {
      dispatch(tagCreateOrUpdateActions.error(error));
    }
    dispatch(tagCreateOrUpdateActions.isLoading(false));
  };
}

export const fetchMemberTagListActions = {
  isLoading: createAction('MEMBER_TAG_LIST/RETRIEVE/IS_LOADING'),
  error: createAction('MEMBER_TAG_LIST/RETRIEVE/ERROR'),
  success: createAction('MEMBER_TAG_LIST/RETRIEVE/SUCCESS'),
};
export function fetchMemberTagList(
  companyId: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMemberTagListActions.isLoading(true));
    dispatch(fetchMemberTagListActions.error(null));
    try {
      const response = await api.fetchMemberTagList(companyId);
      dispatch(fetchMemberTagListActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchMemberTagListActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchMemberTagListActions.isLoading(false));
  };
}
