// @flow

import { createAction } from 'redux-actions';
import { createDictionnaryById, createIdList } from '../../actions/utils';
import type { Dispatch, ThunkAction } from '../../state/types';

import {
  getActiveCampaignAccount as getActiveCampaignAccountAPI,
  updateActiveCampaignAccount as updateActiveCampaignAccountAPI,
  deleteActiveCampaignAccount as deleteActiveCampaignAccountAPI,
  createActiveCampaignAccount as createActiveCampaignAccountAPI,
  getActiveCampaignListsLinks as getActiveCampaignListsLinksAPI,
  updateActiveCampaignListsLinks as updateActiveCampaignListsLinksAPI,
  deleteActiveCampaignListsLinks as deleteActiveCampaignListsLinksAPI,
  createActiveCampaignListsLinks as createActiveCampaignListsLinksAPI,
  getActiveCampaignLists as getActiveCampaignListsAPI,
  fetchWebhooks as getActiveCampaignWebhooksAPI,
} from './api';

import withIntercomAction from '../../hocs/tracking/dispatch-action.hoc';

// Active campaign Account
export const activeCampaignAccountListAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_ACCOUNT/LIST/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_ACCOUNT/LIST/ERROR'),
  success: createAction('ACTIVE_CAMPAIGN_ACCOUNT/LIST/SUCCESS'),
};

export function fetchActiveCampaignAccount(
  options: OptionCallBack,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(activeCampaignAccountListAction.isLoading(true));
    dispatch(activeCampaignAccountListAction.error(null));
    try {
      const response = await getActiveCampaignAccountAPI();
      dispatch(activeCampaignAccountListAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data[0].id);
      }
    } catch (err) {
      dispatch(activeCampaignAccountListAction.error(err));
    }
    dispatch(activeCampaignAccountListAction.isLoading(false));
  };
}

export const activeCampaignAccountUpdateAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_ACCOUNT/UPDATE/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_ACCOUNT/UPDATE/ERROR'),
  success: createAction('ACTIVE_CAMPAIGN_ACCOUNT/UPDATE/SUCCESS'),
};

export function updateActiveCampaignAccount(
  id: number,
  data: any,
  options: OptionCallBack,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(activeCampaignAccountUpdateAction.isLoading(true));
    dispatch(activeCampaignAccountUpdateAction.error(null));
    try {
      const response = await updateActiveCampaignAccountAPI(id, data);
      dispatch(activeCampaignAccountUpdateAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      dispatch(activeCampaignAccountUpdateAction.error(err));
    }
    dispatch(activeCampaignAccountUpdateAction.isLoading(false));
  };
}

export const activeCampaignAccountDeleteAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_ACCOUNT/DELETE/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_ACCOUNT/DELETE/ERROR'),
  success: createAction('ACTIVE_CAMPAIGN_ACCOUNT/DELETE/SUCCESS'),
};

export function deleteActiveCampaignAccount(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(activeCampaignAccountDeleteAction.isLoading(true));
    dispatch(activeCampaignAccountDeleteAction.error(null));
    try {
      await deleteActiveCampaignAccountAPI(id);
      dispatch(activeCampaignAccountDeleteAction.success(id));
    } catch (err) {
      dispatch(activeCampaignAccountDeleteAction.error(err));
    }
    dispatch(activeCampaignAccountDeleteAction.isLoading(false));
  };
}

export const activeCampaignAccountCreateAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_ACCOUNT/CREATE/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_ACCOUNT/CREATE/ERROR'),
  success: withIntercomAction('Create ActiveCampaign account')(
    createAction('ACTIVE_CAMPAIGN_ACCOUNT/CREATE/SUCCESS'),
  ),
};

export function createActiveCampaignAccount(
  data: any,
  options: OptionCallBack,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(activeCampaignAccountCreateAction.isLoading(true));
    dispatch(activeCampaignAccountCreateAction.error(null));
    try {
      const response = await createActiveCampaignAccountAPI(data);
      dispatch(activeCampaignAccountCreateAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.id);
      }
    } catch (err) {
      dispatch(activeCampaignAccountCreateAction.error(err));
    }
    dispatch(activeCampaignAccountCreateAction.isLoading(false));
  };
}

// Active campaign lists links
export const activeCampaignLinksListAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_LINKS/LIST/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_LINKS/LIST/ERROR'),
  success: createAction('ACTIVE_CAMPAIGN_LINKS/LIST/SUCCESS'),
};

export function fetchActiveCampaignLinks(options: OptionCallBack): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(activeCampaignLinksListAction.isLoading(true));
    dispatch(activeCampaignLinksListAction.error(null));
    try {
      const response = await getActiveCampaignListsLinksAPI();
      dispatch(
        activeCampaignLinksListAction.success({
          linksIdList: createIdList(response.data),
          linksDict: createDictionnaryById(response.data),
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      dispatch(activeCampaignLinksListAction.error(err));
    }
    dispatch(activeCampaignLinksListAction.isLoading(false));
  };
}

export const activeCampaignLinksUpdateAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_LINKS/UPDATE/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_LINKS/UPDATE/ERROR'),
  success: createAction('ACTIVE_CAMPAIGN_LINKS/UPDATE/SUCCESS'),
};

export function updateActiveCampaignLinks(id: number, data: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(activeCampaignLinksUpdateAction.isLoading(true));
    dispatch(activeCampaignLinksUpdateAction.error(null));
    try {
      const response = await updateActiveCampaignListsLinksAPI(id, data);
      dispatch(activeCampaignLinksUpdateAction.success(response.data));
    } catch (err) {
      dispatch(activeCampaignLinksUpdateAction.error(err));
    }
    dispatch(activeCampaignLinksUpdateAction.isLoading(false));
  };
}

export const activeCampaignLinksDeleteAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_LINKS/DELETE/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_LINKS/DELETE/ERROR'),
  success: createAction('ACTIVE_CAMPAIGN_LINKS/DELETE/SUCCESS'),
};

export function deleteActiveCampaignLinks(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(activeCampaignLinksDeleteAction.isLoading(true));
    dispatch(activeCampaignLinksDeleteAction.error(null));
    try {
      await deleteActiveCampaignListsLinksAPI(id);
      dispatch(activeCampaignLinksDeleteAction.success(id));
    } catch (err) {
      dispatch(activeCampaignLinksDeleteAction.error(err));
    }
    dispatch(activeCampaignLinksDeleteAction.isLoading(false));
  };
}

export const activeCampaignLinksCreateAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_LINKS/CREATE/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_LINKS/CREATE/ERROR'),
  success: withIntercomAction('Create ActiveCampaign list linking')(
    createAction('ACTIVE_CAMPAIGN_LINKS/CREATE/SUCCESS'),
  ),
};

export function createActiveCampaignLinks(data: any): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(activeCampaignLinksCreateAction.isLoading(true));
    dispatch(activeCampaignLinksCreateAction.error(null));
    try {
      const response = await createActiveCampaignListsLinksAPI(data);
      dispatch(activeCampaignLinksCreateAction.success(response.data));
    } catch (err) {
      dispatch(activeCampaignLinksCreateAction.error(err));
    }
    dispatch(activeCampaignLinksCreateAction.isLoading(false));
  };
}

export const getActiveCampaignListsAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_LINKS/GET_LISTS/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_LINKS/GET_LISTS/ERROR'),
  success: createAction('ACTIVE_CAMPAIGN_LINKS/GET_LISTS/SUCCESS'),
};

export function getActiveCampaignLists(id: number): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(getActiveCampaignListsAction.isLoading(true));
    dispatch(getActiveCampaignListsAction.error(null));
    try {
      const response = await getActiveCampaignListsAPI(id);
      dispatch(getActiveCampaignListsAction.success(response.data));
    } catch (err) {
      dispatch(getActiveCampaignListsAction.error(err.response.status));
    }
    dispatch(getActiveCampaignListsAction.isLoading(false));
  };
}

export const getActiveCampaignWebhooksAction = {
  isLoading: createAction('ACTIVE_CAMPAIGN_ACCOUNT/GET_WEBHOOKS/LOADING'),
  error: createAction('ACTIVE_CAMPAIGN_ACCOUNT/GET_WEBHOOKS/ERROR'),
  success: createAction('ACTIVE_CAMPAIGN_ACCOUNT/GET_WEBHOOKS/SUCCESS'),
};

export function getActiveCampaignWebhooks(
  id,
  options: OptionCallBack,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(getActiveCampaignWebhooksAction.isLoading(true));
    dispatch(getActiveCampaignWebhooksAction.error(null));
    try {
      const response = await getActiveCampaignWebhooksAPI(id);
      dispatch(getActiveCampaignWebhooksAction.success(response.data));
    } catch (err) {
      dispatch(getActiveCampaignWebhooksAction.error(err.response.status));
    }
    dispatch(getActiveCampaignWebhooksAction.isLoading(false));
    if (options && options.onFinish) {
      options.onFinish();
    }
  };
}
