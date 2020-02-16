// @flow

import { createAction } from 'redux-actions';
import {
  sendMailToMembers as sendMailToMembersAPI,
  fetchCampaign as fetchCampaignAPI,
  fetchCampaignReport as fetchCampaignReportAPI,
  fetchCampaignList as fetchCampaignListAPI,
  fetchRecipientList as fetchRecipientListAPI,
} from './api';

import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';
import type { MemberMailData } from './types';

import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';

export const membersMailAction = {
  error: createAction('MEMBERS/SEND-MAIL/ERROR'),
  isloading: createAction('MEMBERS/SEND-MAIL/IS_LOADING'),
};

export function mailMembers(data: MemberMailData): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(membersMailAction.isloading(true));
    dispatch(membersMailAction.error(null));
    try {
      await sendMailToMembersAPI(data);
      dispatch(snackbarSuccess('communication:mail.success'));
    } catch (error) {
      dispatch(membersMailAction.error(error));
      dispatch(snackbarError('communication:mail.error'));
    }
    dispatch(membersMailAction.isloading(false));
  };
}

export const campaignBySmartlistActions = {
  error: createAction('CAMPAIGN/LIST/ERROR'),
  isLoading: createAction('CAMPAIGN/LIST/LOADING'),
  success: createAction('CAMPAIGN/LIST/SUCCESS'),
};

export function fetchCampaignSmartlist(
  smartlist: number,
  page: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(campaignBySmartlistActions.isLoading(true));
    dispatch(campaignBySmartlistActions.error(null));
    try {
      const response = await fetchCampaignListAPI({ smartlist, page });
      dispatch(campaignBySmartlistActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(campaignBySmartlistActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(campaignBySmartlistActions.isLoading(false));
  };
}

export const recipientListActions = {
  error: createAction('RECIPIENT/LIST/ERROR'),
  isLoading: createAction('RECIPIENT/LIST/LOADING'),
  success: createAction('RECIPIENT/LIST/SUCCESS'),
};

export function fetchRecipientByCampaign(
  campaign: string,
  page: number,
  params: any = {},
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(recipientListActions.isLoading(true));
    dispatch(recipientListActions.error(null));
    try {
      const response = await fetchRecipientListAPI({
        page,
        campaign,
        page_size: 15,
        ...params,
      });
      dispatch(recipientListActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(recipientListActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(recipientListActions.isLoading(false));
  };
}

export const campaignDetailActions = {
  error: createAction('CAMPAIGN/DETAIL/ERROR'),
  isLoading: createAction('CAMPAIGN/DETAIL/LOADING'),
  success: createAction('CAMPAIGN/DETAIL/SUCCESS'),
};

export function fetchCampaign(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(campaignDetailActions.isLoading(true));
    dispatch(campaignDetailActions.error(null));
    try {
      const response = await fetchCampaignAPI(id);
      dispatch(campaignDetailActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(campaignDetailActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(campaignDetailActions.isLoading(false));
  };
}

export const campaignReportActions = {
  error: createAction('CAMPAIGN/REPORT/ERROR'),
  isLoading: createAction('CAMPAIGN/REPORT/LOADING'),
  success: createAction('CAMPAIGN/REPORT/SUCCESS'),
};

export function fetchCampaignReport(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(campaignReportActions.isLoading(true));
    dispatch(campaignReportActions.error(null));
    try {
      const response = await fetchCampaignReportAPI(id);
      dispatch(campaignReportActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(campaignReportActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(campaignReportActions.isLoading(false));
  };
}

export const campaignByMemberActions = {
  error: createAction('CAMPAIGN/BY_MEMBER/ERROR'),
  isLoading: createAction('CAMPAIGN/BY_MEMBER/LOADING'),
  success: createAction('CAMPAIGN/BY_MEMBER/SUCCESS'),
};

export function fetchCampaignByMember(
  member: number,
  page: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(campaignByMemberActions.isLoading(true));
    dispatch(campaignByMemberActions.error(null));
    try {
      const response = await fetchCampaignListAPI({
        member,
        page,
        page_size: 3,
      });
      dispatch(campaignByMemberActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(campaignByMemberActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(campaignByMemberActions.isLoading(false));
  };
}

export const recipientBulkActions = {
  error: createAction('RECIPIENT/BULK/ERROR'),
  isLoading: createAction('RECIPIENT/BULK/LOADING'),
  success: createAction('RECIPIENT/BULK/SUCCESS'),
};

export function fetchRecipientBulk(
  member: number,
  campaign_ids: Array<string>,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(recipientBulkActions.isLoading(true));
    dispatch(recipientBulkActions.error(null));
    try {
      const response = await fetchRecipientListAPI({
        member,
        campaign__in: campaign_ids,
        page_size: null,
      });
      dispatch(recipientBulkActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(recipientBulkActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(recipientBulkActions.isLoading(false));
  };
}
