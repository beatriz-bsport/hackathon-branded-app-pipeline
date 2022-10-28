import { createAction } from 'redux-actions';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

import {
  fetchCommunicationSentList as fetchCommunicationSentListAPI,
  fetchCommunicationRecipientList as fetchCommunicationRecipientListAPI,
  fetchAvailableRecipientMemberLists as fetchAvailableRecipientMemberListsAPI,
  sendCommunication as sendCommunicationAPI,
} from './api';
import {
  FetchCommunicationParams,
  MessageParams,
  FormatedContext,
  Communication,
} from './types';

// --------- SEND COMMUNICATION ---------

export const sendCommunicationAction = {
  error: createAction('COMMUNICATION/SEND/ERROR'),
  isLoading: createAction('COMMUNICATION/SEND/IS_LOADING'),
};

export function sendCommunication(
  data: MessageParams,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(sendCommunicationAction.isLoading(true));
    dispatch(sendCommunicationAction.error(null));
    try {
      await sendCommunicationAPI(data);
      dispatch(snackbarSuccess('communicationv2.success'));
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(sendCommunicationAction.error(error));
      dispatch(snackbarError('communicationv2.error'));
    }
    dispatch(sendCommunicationAction.isLoading(false));
  };
}

export const availableRecipientAction = {
  error: createAction('AVAILABLE_RECIPIENT/LIST/ERROR'),
  isLoading: createAction('AVAILABLE_RECIPIENT/LIST/IS_LOADING'),
  success: createAction('AVAILABLE_RECIPIENT/LIST/SUCCESS'),
};

export function fetchAvailableRecipientMemberLists(
  context: FormatedContext,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(availableRecipientAction.isLoading(true));
    dispatch(availableRecipientAction.error(null));
    try {
      const response = await fetchAvailableRecipientMemberListsAPI(context);
      dispatch(availableRecipientAction.success(response.data));
    } catch (error) {
      dispatch(availableRecipientAction.error(error));
    }
    dispatch(availableRecipientAction.isLoading(false));
  };
}

// --------- COMMUNICATION THREAD ---------

export const communicationSentAction = {
  error: createAction('COMMUNICATION_SENT/LIST/ERROR'),
  isLoading: createAction('COMMUNICATION_SENT/LIST/IS_LOADING'),
  success: createAction('COMMUNICATION_SENT/LIST/SUCCESS'),
  reset: createAction('COMMUNICATION_SENT/LIST/RESET'),
};

export function fetchCommunicationSentList(
  params: FetchCommunicationParams,
  options?: OptionCallback<Communication[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    if (params.page === 1) {
      dispatch(communicationSentAction.reset());
    }
    dispatch(communicationSentAction.isLoading(true));
    dispatch(communicationSentAction.error(null));
    try {
      const response = await fetchCommunicationSentListAPI(params);
      dispatch(communicationSentAction.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data?.results);
      }
    } catch (error) {
      dispatch(communicationSentAction.error(error));
    }
    dispatch(communicationSentAction.isLoading(false));
  };
}

// --------- RECIPIENTS ---------

export const recipientAction = {
  error: createAction('COMMUNICATION_RECIPIENT/LIST/ERROR'),
  isLoading: createAction('COMMUNICATION_RECIPIENT/LIST/IS_LOADING'),
  success: createAction('COMMUNICATION_RECIPIENT/LIST/SUCCESS'),
};

export function fetchCommunicationRecipientList(params: {
  page_size: number;
  page: number;
  communication_sent: number;
  member_id__in: number[];
}): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(recipientAction.isLoading(true));
    dispatch(recipientAction.error(null));
    try {
      let data;
      if (!params.member_id__in.length) {
        data = [];
      } else {
        const response = await fetchCommunicationRecipientListAPI(params);
        data = response.data;
      }
      dispatch(recipientAction.success(data));
    } catch (error) {
      dispatch(recipientAction.error(error));
    }
    dispatch(recipientAction.isLoading(false));
  };
}
