import { createAction } from 'redux-actions';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import type { Dispatch, ThunkAction, OptionCallback } from '../../state/types';

import {
  fetchCommunicationSentList as fetchCommunicationSentListAPI,
  fetchCommunicationSent as fetchCommunicationSentAPI,
  fetchCommunicationRecipientList as fetchCommunicationRecipientListAPI,
  sendCommunication as sendCommunicationAPI,
  flagCommunicationRecipientAsRead as flagCommunicationRecipientAsReadAPI,
  flagAllUnreadCommunicationsAsReadInContext as flagAllUnreadCommunicationsAsReadInContextAPI,
  getUnreadAnswersCount as getUnreadAnswersCountAPI,
  fetchCommunicationProviderSettings as fetchCommunicationProviderSettingsAPI,
  updateCommunicationProviderSettings as updateCommunicationProviderSettingsAPI,
} from './api';
import {
  FetchCommunicationParams,
  MessageParams,
  Communication,
  Recipient,
  CommunicationContext,
  CommunicationProviderSettings,
} from './types';
import { COMMUNICATION_SENT_SENDING_PROCESSING } from './constants';

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
          const timeout = 5;
          setTimeout(
            () =>
              dispatch(
                fetchCommunicationSent(response.data.campaign_id, timeout),
              ),
            timeout * 1000,
          );
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
  refresh: createAction('COMMUNICATION_SENT/LIST/REFRESH'),
};

export function fetchCommunicationSentList(
  params: FetchCommunicationParams,
  isRefreshingThread: boolean,
  options?: OptionCallback<Communication[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    if (params.page === 1 && !isRefreshingThread) {
      dispatch(communicationSentAction.reset());
    }
    dispatch(communicationSentAction.isLoading(true));
    dispatch(communicationSentAction.error(null));
    try {
      const response = await fetchCommunicationSentListAPI(params);
      if (isRefreshingThread) {
        dispatch(communicationSentAction.refresh(response.data));
      } else {
        dispatch(communicationSentAction.success(response.data));
      }
      if (options && options.onSuccess) {
        options.onSuccess(response.data?.results);
      }
    } catch (error) {
      dispatch(communicationSentAction.error(error));
    }
    dispatch(communicationSentAction.isLoading(false));
  };
}

export const retrieveCommunicationSentAction = {
  error: createAction('COMMUNICATION_SENT/RETRIEVE/ERROR'),
  isLoading: createAction('COMMUNICATION_SENT/RETRIEVE/IS_LOADING'),
  success: createAction('COMMUNICATION_SENT/RETRIEVE/SUCCESS'),
};

export function fetchCommunicationSent(
  campaign_id: string,
  initialTimeout: number, // seconds
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(retrieveCommunicationSentAction.isLoading(true));
    dispatch(retrieveCommunicationSentAction.error(null));
    try {
      const response = await fetchCommunicationSentAPI(campaign_id);
      const payload = { [response.data.id]: response.data };
      dispatch(retrieveCommunicationSentAction.success(payload));
      if (response.data.status === COMMUNICATION_SENT_SENDING_PROCESSING) {
        const newTimeout = initialTimeout + 5;
        if (newTimeout <= 120)
          setTimeout(
            () =>
              dispatch(
                fetchCommunicationSent(response.data.campaign_id, newTimeout),
              ),
            newTimeout * 1000,
          ); // refresh until a limit time
      }
    } catch (error) {
      dispatch(retrieveCommunicationSentAction.error(error));
    }
    dispatch(retrieveCommunicationSentAction.isLoading(false));
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

export const flagAsReadActions = {
  error: createAction('COMMUNICATION_RECIPIENT/FLAG_AS_READ/ERROR'),
  success: createAction('COMMUNICATION_RECIPIENT/FLAG_AS_READ/SUCCESS'),
  isLoading: createAction('COMMUNICATION_RECIPIENT/FLAG_AS_READ/IS_LOADING'),
};

export function flagCommunicationRecipientAsRead(
  id: number,
  options: OptionCallback<Recipient>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(flagAsReadActions.isLoading(true));
    dispatch(flagAsReadActions.error(null));
    try {
      const response = await flagCommunicationRecipientAsReadAPI(id);
      dispatch(flagAsReadActions.success(response.data));
      if (options?.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      dispatch(flagAsReadActions.error(error));
    }
    dispatch(flagAsReadActions.isLoading(false));
  };
}

export const flagAllUnreadCommunicationsAsReadInContextActions = {
  error: createAction('COMMUNICATION_SENT/FLAG_AS_READ_IN_CONTEXT/ERROR'),
  success: createAction('COMMUNICATION_SENT/FLAG_AS_READ_IN_CONTEXT/SUCCESS'),
  isLoading: createAction(
    'COMMUNICATION_SENT/FLAG_AS_READ_IN_CONTEXT/IS_LOADING',
  ),
};

export function flagAllUnreadCommunicationsAsReadInContext(
  params: CommunicationContext,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(flagAllUnreadCommunicationsAsReadInContextActions.isLoading(true));
    dispatch(flagAllUnreadCommunicationsAsReadInContextActions.error(null));
    try {
      const response = await flagAllUnreadCommunicationsAsReadInContextAPI(
        params,
      );
      dispatch(
        flagAllUnreadCommunicationsAsReadInContextActions.success(
          response.data,
        ),
      );
      if (options?.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(flagAllUnreadCommunicationsAsReadInContextActions.error(error));
    }
    dispatch(
      flagAllUnreadCommunicationsAsReadInContextActions.isLoading(false),
    );
  };
}

// --------- COMMUNICATION SENT ---------

export const getUnreadAnswersCountActions = {
  error: createAction('COMMUNICATION_SENT/UNREAD_ANSWERS_COUNT/ERROR'),
  success: createAction('COMMUNICATION_SENT/UNREAD_ANSWERS_COUNT/SUCCESS'),
  isLoading: createAction('COMMUNICATION_SENT/UNREAD_ANSWERS_COUNT/IS_LOADING'),
};

export function getUnreadAnswersCount(
  params: CommunicationContext,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(getUnreadAnswersCountActions.isLoading(true));
    dispatch(getUnreadAnswersCountActions.error(null));
    try {
      const response = await getUnreadAnswersCountAPI(params);
      dispatch(getUnreadAnswersCountActions.success(response.data));
    } catch (error) {
      dispatch(getUnreadAnswersCountActions.error(error));
    }
    dispatch(getUnreadAnswersCountActions.isLoading(false));
  };
}

// --------- COMPANY COMMUNICATION PROVIDERS ---------

export const fetchCommunicationProviderSettingsActions = {
  error: createAction('COMMUNICATION_PROVIDER/FETCH/ERROR'),
  success: createAction('COMMUNICATION_PROVIDER/FETCH/SUCCESS'),
  isLoading: createAction('COMMUNICATION_PROVIDER/FETCH/IS_LOADING'),
};

export function fetchCommunicationProviderSettings(kind: string): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(
      fetchCommunicationProviderSettingsActions.isLoading({
        loading: true,
        kind,
      }),
    );
    dispatch(
      fetchCommunicationProviderSettingsActions.error({
        error: null,
        kind,
      }),
    );
    try {
      const response = await fetchCommunicationProviderSettingsAPI(kind);
      dispatch(
        fetchCommunicationProviderSettingsActions.success(response.data),
      );
    } catch (error) {
      dispatch(
        fetchCommunicationProviderSettingsActions.error({
          error,
          kind,
        }),
      );
    }
    dispatch(
      fetchCommunicationProviderSettingsActions.isLoading({
        loading: false,
        kind,
      }),
    );
  };
}

export const updateCommunicationProviderSettingsActions = {
  error: createAction('COMMUNICATION_PROVIDER/UPDATE/ERROR'),
  isLoading: createAction('COMMUNICATION_PROVIDER/UPDATE/IS_LOADING'),
};

export function updateCommunicationProviderSettings(
  kind: string,
  data: CommunicationProviderSettings,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(
      updateCommunicationProviderSettingsActions.isLoading({
        loading: true,
        kind,
      }),
    );
    dispatch(
      updateCommunicationProviderSettingsActions.error({
        error: null,
        kind,
      }),
    );
    try {
      const response = await updateCommunicationProviderSettingsAPI(kind, data);
      dispatch(
        fetchCommunicationProviderSettingsActions.success(response.data),
      );
      dispatch(snackbarSuccess('communicationProviderSettings.update.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      dispatch(
        updateCommunicationProviderSettingsActions.error({
          error,
          kind,
        }),
      );
      dispatch(snackbarError('communicationProviderSettings.update.error'));
    }
    dispatch(
      updateCommunicationProviderSettingsActions.isLoading({
        loading: false,
        kind,
      }),
    );
  };
}
