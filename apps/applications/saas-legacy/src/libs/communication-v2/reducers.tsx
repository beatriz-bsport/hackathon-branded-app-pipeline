import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import {
  COMMUNICATION_KIND,
  INBOX_THREAD_PAGE_SIZE,
} from '#src/libs/communication-v2/constants';
import {
  sendCommunicationAction,
  recipientAction,
  communicationSentAction,
  retrieveCommunicationSentAction,
  flagAllUnreadCommunicationsAsReadInContextActions,
  getUnreadAnswersCountActions,
  fetchCommunicationProviderSettingsActions,
  updateCommunicationProviderSettingsActions,
  smartListPopupSendingActions,
  fetchCommunicationThreadActions,
  fetchUnreadAnswersCountsActions,
  switchStatusActions,
  getCommunicationThreadActions,
  getOrCreateThreadActions,
  createCommunicationScheduledActions,
  fetchCommunicationScheduledListActions,
  retrieveCommunicationScheduledActions,
  deleteCommunicationScheduledActions,
  updateCommunicationScheduledActions,
  sendNowCommunicationScheduledActions,
  fetchCommunicationScheduledListForSmartlistActions,
  retrieveCommunicationSMSProviderVerificationActions,
  firstReachedRecipientsAction,
  fetchConversationsActions,
  fetchConversationUnreadCountActions,
  resetConversationUnreadCount,
  createConversationActions,
  createMessageActions,
  fetchMessagesActions,
  FetchMessagesSuccessActionInput,
  CreateMessageSuccessActionInput,
  fetchConversationLastActivityActions,
  FetchConversationLastActivitySuccessActionInput,
  FetchConversationLastActivityLoadingActionInput,
  FetchConversationLastActivityErrorActionInput,
} from '#src/libs/communication-v2/actions';

import type {
  CommunicationState,
  Recipient,
  Communication,
  SmartListPopupSending,
  CommunicationThread,
  UnreadAnswersCount,
  CommunicationScheduled,
  MemberListDataByCommunicationKind,
  ConversationListResponse,
  ConversationUnreadCountResponse,
  Conversation,
  ConversationCreationOutput,
  ConversationMessage,
} from '#src/libs/communication-v2/types';
import type { PaginatedResponse } from '#src/state/types';

const initialState: Immutable.Immutable<CommunicationState> =
  Immutable<CommunicationState>({
    recipient: {
      byId: {},
      allPageIds: [],
      count: 0,
      loading: false,
      error: null,
    },
    sent: {
      byId: {},
      messageList: {
        allIds: [],
        loading: false,
        error: null,
        page: null,
        next_page: null,
        count: 0,
      },
    },
    send: {
      loading: false,
      error: null,
    },
    flagAsReadByContext: {
      loading: false,
      error: null,
    },
    unreadAnswers: {
      loading: false,
      error: null,
      count: 0,
    },
    company_communication_provider: {
      email: {
        provider: null,
        loading: false,
        error: null,
        update: {
          loading: false,
          error: null,
        },
      },
      sms: {
        provider: null,
        loading: false,
        error: null,
        update: {
          loading: false,
          error: null,
        },
      },
      push_notification: {
        provider: null,
        loading: false,
        error: null,
        update: {
          loading: false,
          error: null,
        },
      },
    },
    smartListPopupSending: {
      loading: false,
      error: null,
      byId: {},
      allIds: [],
    },
    inboxThread: {
      byId: {},
      member: {
        allIds: [],
        page: null,
        next_page: null,
        count: 0,
        loading: false,
      },
      offer: {
        allIds: [],
        page: null,
        next_page: null,
        count: 0,
        loading: false,
      },
      smartlist: {
        allIds: [],
        page: null,
        next_page: null,
        count: 0,
        loading: false,
      },
      unreadAnswersCountsById: {},
      allUnreadAnswersCount: 0,
      currentThread: {
        loading: false,
        error: null,
      },
      loading: false,
      error: null,
    },
    communicationScheduled: {
      byId: {},
      bySmartlistId: {
        all: {},
        loading: false,
        error: null,
      },
      allIds: [],
      page: 1,
      next_page: null,
      count: null,
      loading: false,
      error: null,
    },
    communicationSMSProviderVerification: {
      isVerified: true,
      loading: false,
      error: null,
    },
    firstReachedRecipients: {
      byKind: {
        email: [],
        phone: [],
        notification: [],
      },
      loading: false,
      error: null,
    },
    conversations: {
      allIds: [],
      byId: {},
      count: 0,
      next: null,
      next_page: null,
      previous: null,
      unreadCount: 0,
      loading: false,
      error: null,
    },
    messages: {
      allMessageIdsByConversationId: {},
      allMessagesById: {},
      moreMessagesByConversationId: {},
      loading: false,
      error: null,
    },
  });

export default handleActions<Immutable.Immutable<CommunicationState>, any>(
  {
    [sendCommunicationAction.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['send', 'loading'], payload);
    },
    [sendCommunicationAction.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['send', 'error'], payload);
    },
    [sendCommunicationAction.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            sent: {
              byId: { [payload.id]: payload },
            },
          },
          { deep: true },
        )
        .setIn(
          ['sent', 'messageList', 'allIds'],
          [...state.sent.messageList.allIds, payload.id],
        );
    },
    [recipientAction.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['recipient', 'loading'], payload);
    },
    [recipientAction.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['recipient', 'error'], payload);
    },
    [recipientAction.success.toString()]: (state, { payload }: any) => {
      return state
        .merge(
          {
            recipient: {
              byId: payload.results.reduce(
                (acc: Recipient<number>[], recipient: Recipient<number>) => {
                  acc[recipient.id] = recipient;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['recipient', 'allPageIds'],
          payload.results.map((recipient: Recipient<number>) => recipient.id),
        )
        .setIn(['recipient', 'count'], payload.count);
    },
    [firstReachedRecipientsAction.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['firstReachedRecipients', 'loading'], payload);
    },
    [firstReachedRecipientsAction.error.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['firstReachedRecipients', 'error'], payload);
    },
    [firstReachedRecipientsAction.success.toString()]: (
      state,
      { payload }: { payload: MemberListDataByCommunicationKind },
    ) => {
      return state.setIn(['firstReachedRecipients', 'byKind'], payload);
    },
    [communicationSentAction.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['sent', 'messageList', 'loading'], payload);
    },
    [communicationSentAction.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['sent', 'messageList', 'error'], payload);
    },
    [communicationSentAction.success.toString()]: (state, { payload }: any) => {
      const communicationSorted = payload.results
        .map((communication: Communication) => communication.id)
        .slice()
        .reverse();
      return state
        .merge(
          {
            sent: {
              byId: payload.results.reduce(
                (acc: Communication[], communication: Communication) => {
                  acc[communication.id] = communication;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['sent', 'messageList', 'allIds'],
          payload.page > 1
            ? [...communicationSorted, ...state.sent.messageList.allIds]
            : communicationSorted,
        )
        .setIn(['sent', 'messageList', 'count'], payload.count)
        .setIn(['sent', 'messageList', 'page'], payload.page)
        .setIn(['sent', 'messageList', 'next_page'], payload.next_page);
    },
    [communicationSentAction.refresh.toString()]: (state, { payload }: any) => {
      const lastCommunicationSorted = payload.results
        .map((communication: Communication) => communication.id)
        .slice()
        .reverse();
      const previousCommunicationSorted = state.sent.messageList.allIds.filter(
        (id: number) => !lastCommunicationSorted.includes(id),
      );
      return state
        .merge(
          {
            sent: {
              byId: payload.results.reduce(
                (acc: Communication[], communication: Communication) => {
                  acc[communication.id] = communication;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['sent', 'messageList', 'allIds'],
          [...previousCommunicationSorted, ...lastCommunicationSorted],
        );
    },
    [communicationSentAction.reset.toString()]: (state) => {
      return state
        .setIn(['sent', 'messageList', 'allIds'], [])
        .setIn(['sent', 'messageList', 'next_page'], null);
    },
    [retrieveCommunicationSentAction.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge({ sent: { byId: payload } }, { deep: true });
    },
    [flagAllUnreadCommunicationsAsReadInContextActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['send', 'error'], payload);
    },
    [flagAllUnreadCommunicationsAsReadInContextActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['send', 'loading'], payload);
    },
    [getUnreadAnswersCountActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['send', 'error'], payload);
    },
    [getUnreadAnswersCountActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['send', 'loading'], payload);
    },
    [getUnreadAnswersCountActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['unreadAnswers', 'count'], payload);
    },
    [fetchCommunicationProviderSettingsActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['company_communication_provider', payload.kind, 'error'],

        payload.error,
      );
    },
    [fetchCommunicationProviderSettingsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['company_communication_provider', payload.kind, 'loading'],

        payload.loading,
      );
    },
    [fetchCommunicationProviderSettingsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      const kind = COMMUNICATION_KIND[payload.kind];
      return state.setIn(
        ['company_communication_provider', kind, 'provider'],
        payload,
      );
    },
    [updateCommunicationProviderSettingsActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['company_communication_provider', payload.kind, 'update', 'error'],

        payload.error,
      );
    },
    [updateCommunicationProviderSettingsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['company_communication_provider', payload.kind, 'update', 'loading'],

        payload.loading,
      );
    },
    [smartListPopupSendingActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['smartListPopupSending', 'loading'], payload);
    },
    [smartListPopupSendingActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['smartListPopupSending', 'error'], payload);
    },
    [smartListPopupSendingActions.success.toString()]: (
      state,
      { payload }: { payload: Array<SmartListPopupSending> },
    ) => {
      return state
        .merge(
          {
            smartListPopupSending: {
              byId: payload.reduce(
                (
                  acc: { [id: number]: SmartListPopupSending },
                  smartListPopupSending: SmartListPopupSending,
                ) => ({
                  ...acc,
                  [smartListPopupSending.id]: smartListPopupSending,
                }),
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['smartListPopupSending', 'allIds'],
          payload.map(
            (smartListPopupSending: SmartListPopupSending) =>
              smartListPopupSending.id,
          ),
        );
    },
    // INBOX THREAD
    [fetchCommunicationThreadActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['inboxThread', 'loading'], payload);
    },
    [fetchCommunicationThreadActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['inboxThread', 'error'], payload);
    },
    [fetchCommunicationThreadActions.reset.toString()]: (
      state,
      { payload }: { payload: ChatThreadKinds },
    ) => {
      return state.setIn(['inboxThread', payload, 'allIds'], []);
    },
    [fetchCommunicationThreadActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: PaginatedResponse<CommunicationThread> & {
          related_object_kind: ChatThreadKinds;
          fetchedPage: number;
        };
      },
    ) => {
      // When the threadList is not reseted, the pages already fetched are not updated.
      // It arrives while loading more threads in the same context and filtering conditions,
      // or when the status of a thread is modified and is not displayable anymore in the current filtering conditions.
      // Then we need the index of the last thread item kept in the threadList (allIds)
      // to have our initial threadList.

      // Here the cutIndex corresponds to the first index not kept in the initial threadList,
      // and is undefined if there's only one page.
      const cutIndex =
        payload.fetchedPage > 1 &&
        (payload.fetchedPage - 1) * INBOX_THREAD_PAGE_SIZE;

      const allIdsByContext = cutIndex
        ? [...state.inboxThread[payload.related_object_kind].allIds].slice(
            0,
            cutIndex,
          )
        : [];

      return state
        .merge(
          {
            inboxThread: {
              // @ts-expect-error
              byId: payload.results.reduce(
                (
                  acc: CommunicationThread[],
                  communicationThread: CommunicationThread,
                ) => {
                  acc[communicationThread.id] = communicationThread;
                  return acc;
                },
                { ...state.inboxThread.byId },
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['inboxThread', payload.related_object_kind, 'allIds'],
          [
            ...allIdsByContext,
            ...payload.results.map((thread: CommunicationThread) => thread.id),
          ],
        )
        .setIn(
          ['inboxThread', payload.related_object_kind, 'count'],
          payload.count,
        )
        .setIn(
          ['inboxThread', payload.related_object_kind, 'page'],
          payload.page,
        )
        .setIn(
          ['inboxThread', payload.related_object_kind, 'next_page'],
          payload.next_page,
        );
    },
    [fetchUnreadAnswersCountsActions.batch.toString()]: (
      state,
      { payload }: { payload: UnreadAnswersCount[] },
    ) => {
      const allUnreadAnswersCount = payload.reduce<number>(
        (total, current) => total + current?.unread_answers_count || 0,
        0,
      );

      return state
        .merge(
          {
            inboxThread: {
              unreadAnswersCountsById: payload.reduce(
                (
                  acc: { [id: number]: number },
                  unreadAnswerCount: UnreadAnswersCount,
                ) => {
                  acc[unreadAnswerCount.communication_thread_id] =
                    unreadAnswerCount.unread_answers_count;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(['inboxThread', 'allUnreadAnswersCount'], allUnreadAnswersCount);
    },
    [fetchUnreadAnswersCountsActions.detail.toString()]: (
      state,
      { payload }: { payload: UnreadAnswersCount },
    ) => {
      return state.setIn(
        [
          'inboxThread',
          'unreadAnswersCountsById',
          payload.communication_thread_id,
        ],
        payload.unread_answers_count,
      );
    },
    [switchStatusActions.success.toString()]: (
      state,
      { payload }: { payload: CommunicationThread },
    ) => {
      return state.setIn(['inboxThread', 'byId', payload.id], payload);
    },
    [getCommunicationThreadActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['inboxThread', 'currentThread', 'loading'], payload);
    },
    [getCommunicationThreadActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['inboxThread', 'currentThread', 'error'], payload);
    },
    [getCommunicationThreadActions.success.toString()]: (
      state,
      { payload }: { payload: CommunicationThread },
    ) => {
      return state.setIn(['inboxThread', 'byId', payload.id], payload);
    },
    [getOrCreateThreadActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['inboxThread', 'getOrCreate', 'loading'], payload);
    },
    [getOrCreateThreadActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['inboxThread', 'getOrCreate', 'error'], payload);
    },
    [getOrCreateThreadActions.success.toString()]: (
      state,
      { payload }: { payload: CommunicationThread },
    ) => {
      return state.setIn(['inboxThread', 'byId', payload.id], payload);
    },

    // --------- COMMUNICATION SCHEDULED ---------
    [createCommunicationScheduledActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationScheduled', 'loading'], payload);
    },
    [createCommunicationScheduledActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationScheduled', 'error'], payload);
    },
    [createCommunicationScheduledActions.success.toString()]: (
      state,
      { payload }: { payload: CommunicationScheduled },
    ) => {
      return state
        .setIn(
          ['communicationScheduled', 'allIds'],
          state.communicationScheduled.allIds.concat(payload.id),
        )
        .setIn(['communicationScheduled', 'byId', payload.id], payload);
    },
    [fetchCommunicationScheduledListActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationScheduled', 'loading'], payload);
    },
    [fetchCommunicationScheduledListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationScheduled', 'error'], payload);
    },
    [fetchCommunicationScheduledListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<CommunicationScheduled> },
    ) => {
      return state
        .setIn(
          ['communicationScheduled', 'allIds'],
          payload.results?.map(
            (communication: CommunicationScheduled) => communication.id,
          ) ?? [],
        )
        .setIn(['communicationScheduled', 'page'], payload.page)
        .setIn(['communicationScheduled', 'count'], payload.count)
        .setIn(['communicationScheduled', 'next_page'], payload.next_page)
        .setIn(
          ['communicationScheduled', 'byId'],
          payload.results?.reduce<{
            [id: number]: CommunicationScheduled;
          }>((acc, currentCommunication) => {
            acc[currentCommunication.id] = currentCommunication;
            return acc;
          }, {}) ?? {},
        );
    },

    [fetchCommunicationScheduledListForSmartlistActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['communicationScheduled', 'bySmartlistId', 'loading'],
        payload,
      );
    },
    [fetchCommunicationScheduledListForSmartlistActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['communicationScheduled', 'bySmartlistId', 'error'],
        payload,
      );
    },
    [fetchCommunicationScheduledListForSmartlistActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          smartlistId: number;
          response: PaginatedResponse<CommunicationScheduled>;
        };
      },
    ) => {
      return state
        .setIn(
          [
            'communicationScheduled',
            'bySmartlistId',
            'all',
            payload.smartlistId.toString(),
            'allIds',
          ],
          payload.response.results?.map(
            (communication: CommunicationScheduled) => communication.id,
          ) ?? [],
        )
        .setIn(
          [
            'communicationScheduled',
            'bySmartlistId',
            'all',
            payload.smartlistId.toString(),
            'page',
          ],
          payload.response.page ?? 1,
        )
        .setIn(
          [
            'communicationScheduled',
            'bySmartlistId',
            'all',
            payload.smartlistId.toString(),
            'count',
          ],
          payload.response.count,
        )
        .setIn(
          [
            'communicationScheduled',
            'bySmartlistId',
            'all',
            payload.smartlistId.toString(),
            'next_page',
          ],
          payload.response.next_page,
        )
        .merge(
          {
            communicationScheduled: {
              byId: payload.response.results.reduce<{
                [id: number]: CommunicationScheduled;
              }>((acc, currentCommunication) => {
                acc[currentCommunication.id] = currentCommunication;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },

    [retrieveCommunicationScheduledActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationScheduled', 'loading'], payload);
    },
    [retrieveCommunicationScheduledActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationScheduled', 'error'], payload);
    },
    [retrieveCommunicationScheduledActions.success.toString()]: (
      state,
      { payload }: { payload: CommunicationScheduled },
    ) => {
      return state
        .setIn(['communicationScheduled', 'allIds'], [payload.id])
        .setIn(['communicationScheduled', 'byId', payload.id], payload);
    },
    [deleteCommunicationScheduledActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationScheduled', 'loading'], payload);
    },
    [deleteCommunicationScheduledActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationScheduled', 'error'], payload);
    },
    [deleteCommunicationScheduledActions.success.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state.setIn(
        ['communicationScheduled', 'allIds'],
        state.communicationScheduled.allIds.filter(
          (communicationScheduledId) => communicationScheduledId !== payload,
        ),
      );
    },
    [updateCommunicationScheduledActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationScheduled', 'loading'], payload);
    },
    [updateCommunicationScheduledActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationScheduled', 'error'], payload);
    },
    [updateCommunicationScheduledActions.success.toString()]: (
      state,
      { payload }: { payload: CommunicationScheduled },
    ) => {
      return state.setIn(
        ['communicationScheduled', 'byId', payload.id],
        payload,
      );
    },
    [sendNowCommunicationScheduledActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationScheduled', 'loading'], payload);
    },
    [sendNowCommunicationScheduledActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationScheduled', 'error'], payload);
    },
    [sendNowCommunicationScheduledActions.success.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state.setIn(
        ['communicationScheduled', 'allIds'],
        state.communicationScheduled.allIds.filter(
          (communicationScheduledId) => communicationScheduledId !== payload,
        ),
      );
    },
    [retrieveCommunicationSMSProviderVerificationActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['communicationSMSProviderVerification', 'loading'],
        payload,
      );
    },
    [retrieveCommunicationSMSProviderVerificationActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['communicationSMSProviderVerification', 'error'],
        payload,
      );
    },
    [retrieveCommunicationSMSProviderVerificationActions.success.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['communicationSMSProviderVerification', 'isVerified'],
        payload,
      );
    },

    [fetchConversationsActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['conversations', 'loading'], payload);
    },
    [fetchConversationsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['conversations', 'error'], payload);
    },
    [fetchConversationsActions.success.toString()]: (
      state,
      { payload }: { payload: ConversationListResponse },
    ) => {
      return state
        .merge(
          {
            conversations: {
              byId: payload.results.reduce<{
                [id: string]: Conversation;
              }>((acc, currentConversation) => {
                acc[currentConversation.uuid] = currentConversation;
                return acc;
              }, {}),
              allIds:
                payload.results?.map(
                  (conversation: Conversation) => conversation.uuid,
                ) ?? [],
            },
          },
          { deep: true },
        )
        .setIn(['conversations', 'count'], payload.count)
        .setIn(['conversations', 'next'], payload.next)
        .setIn(['conversations', 'next_page'], payload.next_page)
        .setIn(['conversations', 'previous'], payload.previous);
    },
    [fetchConversationUnreadCountActions.success.toString()]: (
      state,
      { payload }: { payload: ConversationUnreadCountResponse },
    ) => {
      return state.setIn(
        ['conversations', 'unreadCount'],
        payload.unread_count,
      );
    },
    [resetConversationUnreadCount.toString()]: (state) => {
      return state.setIn(['conversations', 'unreadCount'], 0);
    },
    [createConversationActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['conversations', 'loading'], payload);
    },
    [createConversationActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['conversations', 'error'], payload);
    },
    [createConversationActions.success.toString()]: (
      state,
      { payload }: { payload: ConversationCreationOutput },
    ) => {
      return state
        .merge(
          {
            conversations: {
              byId: { [payload.conversation.uuid]: payload.conversation },
              allIds: state.conversations.allIds.concat(
                payload.conversation.uuid,
              ),
            },
          },
          { deep: true },
        )
        .setIn(['conversations', 'count'], state.conversations.count + 1)
        .setIn(['conversations', 'next'], null)
        .setIn(['conversations', 'next_page'], null)
        .setIn(['conversations', 'previous'], null)
        .merge(
          {
            messages: {
              allMessageIdsByConversationId: {
                [payload.conversation.uuid]: [payload.message.id],
              },
              allMessagesById: {
                [payload.message.id]: payload.message,
              },
            },
          },
          { deep: true },
        );
    },
    [fetchConversationLastActivityActions.loading.toString()]: (
      state,
      { payload }: { payload: FetchConversationLastActivityLoadingActionInput },
    ) => {
      return state.setIn(
        [
          'messages',
          'moreMessagesByConversationId',
          payload.conversationUuid,
          'loading',
        ],
        payload.loading,
      );
    },
    [fetchConversationLastActivityActions.error.toString()]: (
      state,
      { payload }: { payload: FetchConversationLastActivityErrorActionInput },
    ) => {
      return state.setIn(
        [
          'messages',
          'moreMessagesByConversationId',
          payload.conversationUuid,
          'error',
        ],
        payload.error,
      );
    },
    [fetchConversationLastActivityActions.success.toString()]: (
      state,
      { payload }: { payload: FetchConversationLastActivitySuccessActionInput },
    ) => {
      return state.setIn(
        [
          'messages',
          'moreMessagesByConversationId',
          payload.conversationUuid,
          'lastActivityMessageId',
        ],
        payload.response.last_message_id,
      );
    },
    [createMessageActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['messages', 'loading'], payload);
    },
    [createMessageActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['messages', 'error'], payload);
    },
    [createMessageActions.success.toString()]: (
      state,
      { payload }: { payload: CreateMessageSuccessActionInput },
    ) => {
      return state.merge(
        {
          messages: {
            allMessageIdsByConversationId: {
              [payload.conversationUuid]: [
                ...(state.messages.allMessageIdsByConversationId[
                  payload.conversationUuid
                ] || []),
                payload.response.id,
              ],
            },
            allMessagesById: {
              [payload.response.id]: payload.response,
            },
          },
        },
        { deep: true },
      );
    },
    [fetchMessagesActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['messages', 'loading'], payload);
    },
    [fetchMessagesActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['messages', 'error'], payload);
    },
    [fetchMessagesActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: FetchMessagesSuccessActionInput;
      },
    ) => {
      // right now we are only pulling older messages
      // transform message array to dictionary
      const messagesById = payload.response.messages.reduce<{
        [id: number]: ConversationMessage;
      }>((acc, message) => {
        acc[message.id] = message;
        return acc;
      }, {});

      // get list of message ids, without dups and sorted
      const messageIds = payload.response.messages.map((message) => message.id);
      const conversationMessageIdsSet = new Set([
        ...messageIds,
        ...(state.messages.allMessageIdsByConversationId[
          payload.conversationUuid
        ] || []),
      ]);
      const conversationMessageIdsArray = Array.from(
        conversationMessageIdsSet,
      ).sort((a, b) => a - b);

      // Get oldest and newest pulled message ids
      // I want to be careful in not including message ids from other
      // sources (like messages created by members), so this is the
      // source of truth and there are no race conditions
      const currentOldestMessageId =
        state.messages.moreMessagesByConversationId?.[payload.conversationUuid]
          ?.oldestPulledMessageId || Infinity;
      const currentNewestMessageId =
        state.messages.moreMessagesByConversationId?.[payload.conversationUuid]
          ?.newestPulledMessageId || -Infinity;

      const oldestPulledMessageId = Math.min(
        ...messageIds,
        currentOldestMessageId,
      );
      const newestPulledMessageId = Math.max(
        ...messageIds,
        currentNewestMessageId,
      );

      // are there older messages?
      // are there newer messages?
      const requestedNewerMessages = payload.params?.direction === 'newer'; // default is older messages
      const olderMessages = requestedNewerMessages
        ? state.messages.moreMessagesByConversationId?.[
            payload.conversationUuid
          ]?.older
        : payload.response.more_messages;
      const newerMessages = requestedNewerMessages
        ? payload.response.more_messages
        : state.messages.moreMessagesByConversationId?.[
            payload.conversationUuid
          ]?.newer;

      let moreMessages = {
        oldestPulledMessageId: oldestPulledMessageId,
        newestPulledMessageId: newestPulledMessageId,
        older: olderMessages,
        newer: newerMessages,
      };

      return state.merge(
        {
          messages: {
            allMessageIdsByConversationId: {
              [payload.conversationUuid]: conversationMessageIdsArray,
            },
            allMessagesById: {
              ...state.messages.allMessagesById,
              ...messagesById,
            },
            moreMessagesByConversationId: {
              [payload.conversationUuid]: moreMessages,
            },
          },
        },
        { deep: true },
      );
    },
  },
  initialState,
);
