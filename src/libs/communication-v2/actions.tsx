import { createAction } from 'redux-actions';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

import {
  fetchCommunicationSentList as fetchCommunicationSentListAPI,
  fetchCommunicationRecipientList as fetchCommunicationRecipientListAPI,
  sendCommunication as sendCommunicationAPI,
} from './api';
import {
  FetchCommunicationParams,
  MessageParams,
  Communication,
  Recipient,
} from './types';

// --------- SEND COMMUNICATION ---------

export const sendCommunicationAction = {
  error: createAction('COMMUNICATION/SEND/ERROR'),
  isLoading: createAction('COMMUNICATION/SEND/IS_LOADING'),
  success: createAction('COMMUNICATION/SEND/SUCCESS'),
};

export function sendCommunication(
  data: MessageParams,
  options: OptionCallback<void> & {
    storeInCallback: (communication: Communication) => boolean;
  },
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(sendCommunicationAction.isLoading(true));
    dispatch(sendCommunicationAction.error(null));
    try {
      const response = await sendCommunicationAPI(data);
      dispatch(snackbarSuccess('communicationv2.success'));
      if (options.onSuccess) options.onSuccess();
      if (options.storeInCallback) {
        const filterOutCommunication = options.storeInCallback(response.data);
        if (!filterOutCommunication) {
          dispatch(sendCommunicationAction.success(response.data));
        }
      }
    } catch (error) {
      if (options.onError) options.onError();
      dispatch(sendCommunicationAction.error(error));
      dispatch(snackbarError('communicationv2.error'));
    }
    dispatch(sendCommunicationAction.isLoading(false));
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

export function fetchCommunicationRecipientList(
  params: {
    page_size: number;
    page: number;
    communication_sent: number;
    member_id__in?: number[];
    offer_with_selected_categories?: string;
  },
  options: OptionCallback<Array<Recipient>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(recipientAction.isLoading(true));
    dispatch(recipientAction.error(null));
    try {
      const response = await fetchCommunicationRecipientListAPI(params);
      dispatch(recipientAction.success(response.data));
      if (options?.onSuccess) options.onSuccess(response.data?.results);
    } catch (error) {
      dispatch(recipientAction.error(error));
    }
    dispatch(recipientAction.isLoading(false));
  };
}
