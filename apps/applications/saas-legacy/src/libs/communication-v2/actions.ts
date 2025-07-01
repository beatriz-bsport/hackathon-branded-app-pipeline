import { createAction } from 'redux-actions';
import type { AxiosResponse } from 'axios';
import uniq from 'lodash/uniq';

import { CUSTOM_ERROR_CODE } from '#src/libs/constants';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import { monitorBackgroundTask } from '#src/libs/background-task/actions';
import { snackbarSuccess, snackbarError } from '#src/libs/snackbar/actions';
import type {
  Dispatch,
  ThunkAction,
  OptionCallback,
  OptionBackgroundCallback,
  PaginatedResponse,
} from '#src/state/types';

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
  fetchSmartListPopupSendings as fetchSmartListPopupSendingsAPI,
  sendSmartListPopup as sendSmartListPopupAPI,
  fetchInboxThreadList as fetchInboxThreadListAPI,
  fetchBatchUnreadAnswersCounts as fetchBatchUnreadAnswersCountsAPI,
  getUnreadAnswersCountFromThread as getUnreadAnswersCountFromThreadAPI,
  switchFavoriteStatus as switchFavoriteStatusAPI,
  switchMutedStatus as switchMutedStatusAPI,
  switchDisabledStatus as switchDisabledStatusAPI,
  flagAsUnread as flagAsUnreadAPI,
  flagAsRead as flagAsReadAPI,
  fetchInboxThreadFromId as fetchInboxThreadFromIdAPI,
  getOrCreateThread as getOrCreateThreadAPI,
  createCommunicationScheduled as createCommunicationScheduledAPI,
  fetchCommunicationScheduledList as fetchCommunicationScheduledListAPI,
  retrieveCommunicationScheduled as retrieveCommunicationScheduledAPI,
  deleteCommunicationScheduled as deleteCommunicationScheduledAPI,
  updateCommunicationScheduled as updateCommunicationScheduledAPI,
  sendNowCommunicationScheduled as sendNowCommunicationScheduledAPI,
  retrieveCommunicationSMSProviderVerification as retrieveCommunicationSMSProviderVerificationAPI,
  fetchFirstSelectedRecipientsForChatAllKinds as fetchFirstSelectedRecipientsForChatAllKindsAPI,
} from '#src/libs/communication-v2/api';
import type {
  FetchCommunicationParams,
  MessageParams,
  Communication,
  Recipient,
  CommunicationContext,
  CommunicationProviderSettings,
  InboxThreadListParams,
  CommunicationThread,
  UnreadAnswersCount,
  FetchInboxThreadListPayload,
  FetchInboxThreadPayload,
  CommunicationScheduled,
  CommunicationScheduledFilters,
  CommunicationScheduledCreate,
  CommunicationScheduledFiltersForUniqueSmartlist,
  FetchFirstReachedRecipientsParams,
  MemberListDataByCommunicationKind,
} from '#src/libs/communication-v2/types';
import { COMMUNICATION_SENT_SENDING_PROCESSING } from '#src/libs/communication-v2/constants';

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
  isRefreshingMessageList: boolean,
  options?: OptionCallback<Communication[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    if (params.page === 1 && !isRefreshingMessageList) {
      dispatch(communicationSentAction.reset());
    }
    dispatch(communicationSentAction.isLoading(true));
    dispatch(communicationSentAction.error(null));
    try {
      const response = await fetchCommunicationSentListAPI(params);
      if (isRefreshingMessageList) {
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

export const firstReachedRecipientsAction = {
  error: createAction('COMMUNICATION_RECIPIENT/FIRST_REACHED/LIST/ERROR'),
  isLoading: createAction(
    'COMMUNICATION_RECIPIENT/FIRST_REACHED/LIST/IS_LOADING',
  ),
  success: createAction('COMMUNICATION_RECIPIENT/FIRST_REACHED/LIST/SUCCESS'),
};

export function fetchFirstReachedRecipientsList({
  params,
  options,
}: {
  params: FetchFirstReachedRecipientsParams;
  options?: OptionCallback<MemberListDataByCommunicationKind>;
}): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(firstReachedRecipientsAction.isLoading(true));
    dispatch(firstReachedRecipientsAction.error(null));
    try {
      const response = await fetchFirstSelectedRecipientsForChatAllKindsAPI(
        params,
      );
      dispatch(firstReachedRecipientsAction.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(firstReachedRecipientsAction.error(error));
      options?.onError?.(error);
    }
    dispatch(firstReachedRecipientsAction.isLoading(false));
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

export const smartListPopupSendingActions = {
  error: createAction('SMARTLIST_POPUP_SENDING/FETCH/ERROR'),
  loading: createAction('SMARTLIST_POPUP_SENDING/FETCH/LOADING'),
  success: createAction('SMARTLIST_POPUP_SENDING/FETCH/SUCCESS'),
};

export function fetchSmartListPopupSendings(params: {
  smartlist_id: number;
}): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(smartListPopupSendingActions.loading(true));
    dispatch(smartListPopupSendingActions.error(null));
    try {
      const response = await fetchSmartListPopupSendingsAPI(params);
      dispatch(smartListPopupSendingActions.success(response.data));
    } catch (error) {
      dispatch(smartListPopupSendingActions.error(error));
    }
    dispatch(smartListPopupSendingActions.loading(false));
  };
}

export function sendSmartListPopup(
  data: FormData,
  options?: OptionBackgroundCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(smartListPopupSendingActions.loading(true));
    dispatch(smartListPopupSendingActions.error(null));

    try {
      const response = await sendSmartListPopupAPI(data);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      if (options) {
        options.onSuccess?.();

        dispatch(
          monitorBackgroundTask(backgroundTaskUuid, {
            onSuccess: () => options.onBackgroundSuccess?.(),
            onError: (error) => {
              dispatch(smartListPopupSendingActions.error(error));
              options.onBackgroundError?.();
            },
          }),
        );
      } else dispatch(monitorBackgroundTask(backgroundTaskUuid));
    } catch (error) {
      dispatch(smartListPopupSendingActions.error(error));
      dispatch(snackbarError('smartListPopup.send.error'));
      if (options && options.onError) options.onError();
    }
    dispatch(smartListPopupSendingActions.loading(false));
  };
}

// --------INBOX THREAD LIST--------

export const fetchCommunicationThreadActions = {
  error: createAction<Error>('COMMUNICATION_THREADS/FETCH/ERROR'),
  loading: createAction<boolean>('COMMUNICATION_THREADS/FETCH/LOADING'),
  success: createAction<FetchInboxThreadListPayload>(
    'COMMUNICATION_THREADS/FETCH/SUCCESS',
  ),
  reset: createAction<ChatThreadKinds>('COMMUNICATION_THREADS/FETCH/RESET'),
};

export const fetchInboxThreadList = (
  params: InboxThreadListParams,
  isThreadListReinitialized?: boolean,
  options?: OptionCallback<CommunicationThread[]>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCommunicationThreadActions.loading(true));
    dispatch(fetchCommunicationThreadActions.error(null));

    try {
      const response = await fetchInboxThreadListAPI(params);
      if (isThreadListReinitialized) {
        dispatch(
          fetchCommunicationThreadActions.reset(params.related_object_kind),
        );
      }
      const payload = {
        ...response.data,
        related_object_kind: params.related_object_kind,
        fetchedPage: params.page,
      };
      dispatch(fetchCommunicationThreadActions.success(payload));
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(fetchCommunicationThreadActions.error(error));
      options?.onError?.();
    }
    dispatch(fetchCommunicationThreadActions.loading(false));
  };
};

export const getOrCreateThreadActions = {
  error: createAction<Error>('COMMUNICATION_THREADS/GET_OR_CREATE/ERROR'),
  loading: createAction<boolean>('COMMUNICATION_THREADS/GET_OR_CREATE/LOADING'),
  success: createAction<FetchInboxThreadPayload>(
    'COMMUNICATION_THREADS/GET_OR_CREATE/SUCCESS',
  ),
};

export const getOrCreateInboxThread = (
  context: ChatThreadKinds,
  resourceId: number,
  options?: OptionCallback<CommunicationThread>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(getOrCreateThreadActions.loading(true));
    dispatch(getOrCreateThreadActions.error(null));

    try {
      const response = await getOrCreateThreadAPI(context, resourceId);
      const payload = {
        ...response.data,
        related_object_kind: context,
      };
      dispatch(getOrCreateThreadActions.success(payload));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(getOrCreateThreadActions.error(error));
      options?.onError?.();
    }
    dispatch(getOrCreateThreadActions.loading(false));
  };
};

export const fetchUnreadAnswersCountsActions = {
  batch: createAction<UnreadAnswersCount[]>(
    'COMMUNICATION_THREADS/UNREAD_ANSWERS_COUNT/BATCH',
  ),
  detail: createAction<UnreadAnswersCount>(
    'COMMUNICATION_THREADS/UNREAD_ANSWERS_COUNT/DETAIL',
  ),
};

export const fetchBatchUnreadAnswersCounts = (
  params: { thread_ids: number[] },
  options?: OptionCallback,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetchBatchUnreadAnswersCountsAPI(params);
      dispatch(fetchUnreadAnswersCountsActions.batch(response.data));
      options?.onSuccess?.();
    } catch (_error) {
      options?.onError?.();
    }
  };
};

export const getUnreadAnswersCountFromThread = (
  id: number,
  options?: OptionCallback,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await getUnreadAnswersCountFromThreadAPI(id);
      const payload = {
        communication_thread_id: id,
        unread_answers_count: response.data,
      };
      dispatch(fetchUnreadAnswersCountsActions.detail(payload));
      options?.onSuccess?.();
    } catch (_error) {
      options?.onError?.();
    }
  };
};

export const switchStatusActions = {
  success: createAction<CommunicationThread>(
    'COMMUNICATION_THREAD/SWITCH_STATUS/SUCCESS',
  ),
  error: createAction<Error>('COMMUNICATION_THREAD/SWITCH_STATUS/ERROR'),
  isLoading: createAction<boolean>(
    'COMMUNICATION_THREAD/SWITCH_STATUS/LOADING',
  ),
};

const switchStatus = (
  apiCall: (id: number) => Promise<AxiosResponse<CommunicationThread>>,
  id: number,
  options?: OptionCallback<CommunicationThread>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(switchStatusActions.isLoading(true));
    dispatch(switchStatusActions.error(null));
    try {
      const response = await apiCall(id);

      dispatch(switchStatusActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(switchStatusActions.error(error));
      options?.onError?.();
    }
    dispatch(switchStatusActions.isLoading(false));
  };
};

export const switchFavoriteStatus = (
  id: number,
  options?: OptionCallback<CommunicationThread>,
): ThunkAction => switchStatus(switchFavoriteStatusAPI, id, options);

export const switchMutedStatus = (
  id: number,
  options?: OptionCallback<CommunicationThread>,
): ThunkAction => switchStatus(switchMutedStatusAPI, id, options);

export const switchDisabledStatus = (
  id: number,
  options?: OptionCallback<CommunicationThread>,
): ThunkAction => switchStatus(switchDisabledStatusAPI, id, options);

export const flagAsUnread = (
  id: number,
  options?: OptionCallback<CommunicationThread>,
): ThunkAction => switchStatus(flagAsUnreadAPI, id, options);

export const flagAsRead = (
  id: number,
  options?: OptionCallback<CommunicationThread>,
): ThunkAction => switchStatus(flagAsReadAPI, id, options);

// --------INBOX CONTAINER--------

export const getCommunicationThreadActions = {
  error: createAction<Error>('COMMUNICATION_THREAD/FETCH/ERROR'),
  loading: createAction<boolean>('COMMUNICATION_THREAD/FETCH/LOADING'),
  success: createAction<CommunicationThread>(
    'COMMUNICATION_THREAD/FETCH/SUCCESS',
  ),
};

export const fetchInboxThreadFromId = (
  id: number,
  options?: OptionCallback<CommunicationThread>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    dispatch(getCommunicationThreadActions.loading(true));
    dispatch(getCommunicationThreadActions.error(null));

    try {
      const response = await fetchInboxThreadFromIdAPI(id);
      dispatch(getCommunicationThreadActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(getCommunicationThreadActions.error(error));
      options?.onError?.();
    }
    dispatch(getCommunicationThreadActions.loading(false));
  };
};

// --------- COMMUNICATION SCHEDULED ---------

export const createCommunicationScheduledActions = {
  error: createAction<Error | null>('COMMUNICATION_SCHEDULED/CREATE/ERROR'),
  loading: createAction<boolean>('COMMUNICATION_SCHEDULED/CREATE/LOADING'),
  success: createAction<CommunicationScheduled>(
    'COMMUNICATION_SCHEDULED/CREATE/SUCCESS',
  ),
};

export const createCommunicationScheduled = (
  communicationScheduled: CommunicationScheduledCreate,
  options?: OptionCallback<CommunicationScheduled>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(createCommunicationScheduledActions.loading(true));
      dispatch(createCommunicationScheduledActions.error(null));
      const response = await createCommunicationScheduledAPI(
        communicationScheduled,
      );
      dispatch(createCommunicationScheduledActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(createCommunicationScheduledActions.error(error));
      options?.onError?.(error);
    } finally {
      dispatch(createCommunicationScheduledActions.loading(false));
    }
  };
};

export const fetchCommunicationScheduledListActions = {
  error: createAction<Error | null>('COMMUNICATION_SCHEDULED/LIST/ERROR'),
  loading: createAction<boolean>('COMMUNICATION_SCHEDULED/LIST/LOADING'),
  success: createAction<PaginatedResponse<CommunicationScheduled>>(
    'COMMUNICATION_SCHEDULED/LIST/SUCCESS',
  ),
};

export const fetchCommunicationScheduledList = (
  filters?: CommunicationScheduledFilters,
  options?: OptionCallback<CommunicationScheduled[]>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    // Check for uniqueness if the filters only include the id__in parameter,
    // preventing a potential issue with Django Rest Framework that fetches the entire database.
    if (filters.id__in && !filters.smartlist_id__in) {
      const uniq_ids = uniq(
        (filters.id__in ?? []).filter(
          (communicationScheduledId) => !!communicationScheduledId,
        ),
      );
      if (uniq_ids.length === 0) {
        return;
      }
    }

    // If the unique list is not empty, proceed with fetching the list of scheduled communications.
    try {
      dispatch(fetchCommunicationScheduledListActions.loading(true));
      dispatch(fetchCommunicationScheduledListActions.error(null));
      const response = await fetchCommunicationScheduledListAPI(filters);
      dispatch(fetchCommunicationScheduledListActions.success(response.data));
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(fetchCommunicationScheduledListActions.error(error));
      options?.onError?.(error);
    } finally {
      dispatch(fetchCommunicationScheduledListActions.loading(false));
    }
  };
};

export const fetchCommunicationScheduledListForSmartlistActions = {
  error: createAction<Error | null>(
    'COMMUNICATION_SCHEDULED/LIST_FOR_SMARTLIST/ERROR',
  ),
  loading: createAction<boolean>(
    'COMMUNICATION_SCHEDULED/LIST_FOR_SMARTLIST/LOADING',
  ),
  success: createAction<{
    smartlistId: number;
    response: PaginatedResponse<CommunicationScheduled>;
  }>('COMMUNICATION_SCHEDULED/LIST_FOR_SMARTLIST/SUCCESS'),
};

export const fetchCommunicationScheduledListForSmartlist = (
  filters: CommunicationScheduledFiltersForUniqueSmartlist,
  options?: OptionCallback<CommunicationScheduled[]>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    if (!filters?.smartlistId) {
      return;
    }
    try {
      dispatch(
        fetchCommunicationScheduledListForSmartlistActions.loading(true),
      );
      dispatch(fetchCommunicationScheduledListForSmartlistActions.error(null));

      const filtersForSmartlist: CommunicationScheduledFilters = {
        smartlist_id__in: [filters.smartlistId],
      };
      if (filters?.page) filtersForSmartlist.page = filters.page;
      const response = await fetchCommunicationScheduledListAPI(
        filtersForSmartlist,
      );

      dispatch(
        fetchCommunicationScheduledListForSmartlistActions.success({
          smartlistId: filters.smartlistId,
          response: response.data,
        }),
      );
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      dispatch(fetchCommunicationScheduledListForSmartlistActions.error(error));
      options?.onError?.(error);
    } finally {
      dispatch(
        fetchCommunicationScheduledListForSmartlistActions.loading(false),
      );
    }
  };
};

export const retrieveCommunicationScheduledActions = {
  error: createAction<Error | null>('COMMUNICATION_SCHEDULED/RETRIEVE/ERROR'),
  loading: createAction<boolean>('COMMUNICATION_SCHEDULED/RETRIEVE/LOADING'),
  success: createAction<CommunicationScheduled>(
    'COMMUNICATION_SCHEDULED/RETRIEVE/SUCCESS',
  ),
};

export const retrieveCommunicationScheduled = (
  id: number,
  options?: OptionCallback<CommunicationScheduled>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(retrieveCommunicationScheduledActions.loading(true));
      dispatch(retrieveCommunicationScheduledActions.error(null));
      const response = await retrieveCommunicationScheduledAPI(id);
      dispatch(retrieveCommunicationScheduledActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(retrieveCommunicationScheduledActions.error(error));
      options?.onError?.(error);
    } finally {
      dispatch(retrieveCommunicationScheduledActions.loading(false));
    }
  };
};

export const deleteCommunicationScheduledActions = {
  error: createAction<Error | null>('COMMUNICATION_SCHEDULED/DELETE/ERROR'),
  loading: createAction<boolean>('COMMUNICATION_SCHEDULED/DELETE/LOADING'),
  success: createAction<number>('COMMUNICATION_SCHEDULED/DELETE/SUCCESS'),
};

export const deleteCommunicationScheduled = (
  id: number,
  options?: OptionCallback<number>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(deleteCommunicationScheduledActions.loading(true));
      dispatch(deleteCommunicationScheduledActions.error(null));
      await deleteCommunicationScheduledAPI(id);
      dispatch(deleteCommunicationScheduledActions.success(id));
      options?.onSuccess?.(id);
    } catch (error) {
      if (error?.response?.status === CUSTOM_ERROR_CODE) {
        const errorCode = error.response.data?.error_code;
        dispatch(snackbarError(`communicationScheduled.delete.${errorCode}`));
      }

      dispatch(deleteCommunicationScheduledActions.error(error));
      options?.onError?.(error);
    } finally {
      dispatch(deleteCommunicationScheduledActions.loading(false));
    }
  };
};

export const updateCommunicationScheduledActions = {
  error: createAction<Error | null>('COMMUNICATION_SCHEDULED/UPDATE/ERROR'),
  loading: createAction<boolean>('COMMUNICATION_SCHEDULED/UPDATE/LOADING'),
  success: createAction<CommunicationScheduled>(
    'COMMUNICATION_SCHEDULED/UPDATE/SUCCESS',
  ),
};

export const updateCommunicationScheduled = (
  id: number,
  updatedCommunicationScheduled: CommunicationScheduled,
  options?: OptionCallback<CommunicationScheduled>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(updateCommunicationScheduledActions.loading(true));
      dispatch(updateCommunicationScheduledActions.error(null));
      const response = await updateCommunicationScheduledAPI(
        id,
        updatedCommunicationScheduled,
      );
      dispatch(updateCommunicationScheduledActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(updateCommunicationScheduledActions.error(error));
      options?.onError?.(error);
    } finally {
      dispatch(updateCommunicationScheduledActions.loading(false));
    }
  };
};

export const sendNowCommunicationScheduledActions = {
  error: createAction<Error | null>('COMMUNICATION_SCHEDULED/SEND_NOW/ERROR'),
  loading: createAction<boolean>('COMMUNICATION_SCHEDULED/SEND_NOW/LOADING'),
  success: createAction<number>('COMMUNICATION_SCHEDULED/SEND_NOW/SUCCESS'),
};

export const sendNowCommunicationScheduled = (
  id: number,
  options?: OptionCallback<CommunicationScheduled>,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(sendNowCommunicationScheduledActions.loading(true));
      dispatch(sendNowCommunicationScheduledActions.error(null));
      const response = await sendNowCommunicationScheduledAPI(id);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(sendNowCommunicationScheduledActions.success(id));
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            options?.onSuccess?.();
            dispatch(retrieveCommunicationScheduled(id));
          },
        }),
      );
    } catch (error) {
      dispatch(sendNowCommunicationScheduledActions.error(error));
      options?.onError?.(error);
    } finally {
      dispatch(sendNowCommunicationScheduledActions.loading(false));
    }
  };
};

export const retrieveCommunicationSMSProviderVerificationActions = {
  error: createAction<Error | null>(
    'COMMUNICATION_SMS_PROVIDER/IS_VERIFIED/ERROR',
  ),
  loading: createAction<boolean>(
    'COMMUNICATION_SMS_PROVIDER/IS_VERIFIED/LOADING',
  ),
  success: createAction<boolean>(
    'COMMUNICATION_SMS_PROVIDER/IS_VERIFIED/SUCCESS',
  ),
};

export const retrieveCommunicationSMSProviderVerification = (
  options?: OptionCallback,
): ThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(
        retrieveCommunicationSMSProviderVerificationActions.loading(true),
      );
      dispatch(retrieveCommunicationSMSProviderVerificationActions.error(null));
      const response = await retrieveCommunicationSMSProviderVerificationAPI();
      dispatch(
        retrieveCommunicationSMSProviderVerificationActions.success(
          response.data,
        ),
      );
    } catch (error) {
      dispatch(
        retrieveCommunicationSMSProviderVerificationActions.error(error),
      );
      options?.onError?.(error);
    } finally {
      dispatch(
        retrieveCommunicationSMSProviderVerificationActions.loading(false),
      );
    }
  };
};
