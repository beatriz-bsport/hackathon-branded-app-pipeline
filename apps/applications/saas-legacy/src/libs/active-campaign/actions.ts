import { createAction } from 'redux-actions';
import type { Dispatch, ThunkAction, OptionCallback } from 'src/state/types';
// @ts-expect-error
import withIntercomAction from '#src/hocs/tracking/dispatch-action.hoc';
// @ts-expect-error
import { createDictionnaryById, createIdList } from '../../actions/utils';
import type {
  ActiveCampaignWebhook,
  Account,
  LinkApi,
  LinksPayload,
  ActiveCampaignList,
} from './types';
import {
  getActiveCampaignAccount as getActiveCampaignAccountAPI,
  updateActiveCampaignAccount as updateActiveCampaignAccountAPI,
  createActiveCampaignAccount as createActiveCampaignAccountAPI,
  getActiveCampaignListsLinks as getActiveCampaignListsLinksAPI,
  updateActiveCampaignListsLinks as updateActiveCampaignListsLinksAPI,
  deleteActiveCampaignListsLinks as deleteActiveCampaignListsLinksAPI,
  createActiveCampaignListsLinks as createActiveCampaignListsLinksAPI,
  getActiveCampaignLists as getActiveCampaignListsAPI,
  fetchWebhooks as getActiveCampaignWebhooksAPI,
} from './api';

// Active campaign Account
export const activeCampaignAccountListAction = {
  isLoading: createAction<boolean>('ACTIVE_CAMPAIGN_ACCOUNT/LIST/LOADING'),
  error: createAction<Error | null>('ACTIVE_CAMPAIGN_ACCOUNT/LIST/ERROR'),
  success: createAction<Account[]>('ACTIVE_CAMPAIGN_ACCOUNT/LIST/SUCCESS'),
};

export function fetchActiveCampaignAccount(
  options?: OptionCallback<number>,
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
  isLoading: createAction<boolean>('ACTIVE_CAMPAIGN_ACCOUNT/UPDATE/LOADING'),
  error: createAction<Error | null>('ACTIVE_CAMPAIGN_ACCOUNT/UPDATE/ERROR'),
  success: createAction<Account>('ACTIVE_CAMPAIGN_ACCOUNT/UPDATE/SUCCESS'),
};

export function updateActiveCampaignAccount(
  id: number,
  data: Account,
  options?: OptionCallback<void>,
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

export const activeCampaignAccountCreateAction = {
  isLoading: createAction<boolean>('ACTIVE_CAMPAIGN_ACCOUNT/CREATE/LOADING'),
  error: createAction<Error | null>('ACTIVE_CAMPAIGN_ACCOUNT/CREATE/ERROR'),
  success: withIntercomAction('Create ActiveCampaign account')(
    createAction<Account>('ACTIVE_CAMPAIGN_ACCOUNT/CREATE/SUCCESS'),
  ),
};

export function createActiveCampaignAccount(
  data: Account,
  options?: OptionCallback<number>,
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
  isLoading: createAction<boolean>('ACTIVE_CAMPAIGN_LINKS/LIST/LOADING'),
  error: createAction<Error | null>('ACTIVE_CAMPAIGN_LINKS/LIST/ERROR'),
  success: createAction<LinksPayload>('ACTIVE_CAMPAIGN_LINKS/LIST/SUCCESS'),
};

export function fetchActiveCampaignLinks(
  options?: OptionCallback<LinkApi[]>,
): ThunkAction {
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
  isLoading: createAction<boolean>('ACTIVE_CAMPAIGN_LINKS/UPDATE/LOADING'),
  error: createAction<Error | null>('ACTIVE_CAMPAIGN_LINKS/UPDATE/ERROR'),
  success: createAction<LinkApi>('ACTIVE_CAMPAIGN_LINKS/UPDATE/SUCCESS'),
};

export function updateActiveCampaignLinks(
  id: number,
  data: LinkApi,
): ThunkAction {
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
  isLoading: createAction<boolean>('ACTIVE_CAMPAIGN_LINKS/DELETE/LOADING'),
  error: createAction<Error | null>('ACTIVE_CAMPAIGN_LINKS/DELETE/ERROR'),
  success: createAction<number>('ACTIVE_CAMPAIGN_LINKS/DELETE/SUCCESS'),
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
  isLoading: createAction<boolean>('ACTIVE_CAMPAIGN_LINKS/CREATE/LOADING'),
  error: createAction<Error | null>('ACTIVE_CAMPAIGN_LINKS/CREATE/ERROR'),
  success: withIntercomAction('Create ActiveCampaign list linking')(
    createAction<LinkApi>('ACTIVE_CAMPAIGN_LINKS/CREATE/SUCCESS'),
  ),
};

export function createActiveCampaignLinks(data: LinkApi): ThunkAction {
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
  isLoading: createAction<boolean>('ACTIVE_CAMPAIGN_LINKS/GET_LISTS/LOADING'),
  error: createAction<number | null>('ACTIVE_CAMPAIGN_LINKS/GET_LISTS/ERROR'),
  success: createAction<ActiveCampaignList[]>(
    'ACTIVE_CAMPAIGN_LINKS/GET_LISTS/SUCCESS',
  ),
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
  isLoading: createAction<boolean>(
    'ACTIVE_CAMPAIGN_ACCOUNT/GET_WEBHOOKS/LOADING',
  ),
  error: createAction<number | null>(
    'ACTIVE_CAMPAIGN_ACCOUNT/GET_WEBHOOKS/ERROR',
  ),
  success: createAction<ActiveCampaignWebhook>(
    'ACTIVE_CAMPAIGN_ACCOUNT/GET_WEBHOOKS/SUCCESS',
  ),
};

export function getActiveCampaignWebhooks(
  id: number,
  options?: OptionCallback & { onFinish?: () => void },
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
