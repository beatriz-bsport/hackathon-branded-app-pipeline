import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import {
  sendCommunicationAction,
  recipientAction,
  communicationSentAction,
  retrieveCommunicationSentAction,
  flagAllUnreadCommunicationsAsReadInContextActions,
  getUnreadAnswersCountActions,
  fetchCommunicationProviderSettingsActions,
  updateCommunicationProviderSettingsActions,
} from './actions';

import type { CommunicationState, Recipient, Communication } from './types';
import { COMMUNICATION_KIND } from './constants';

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
      thread: {
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
  });

export default handleActions<Immutable.Immutable<CommunicationState>>(
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
          ['sent', 'thread', 'allIds'],
          [...state.sent.thread.allIds, payload.id],
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
    [communicationSentAction.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['sent', 'thread', 'loading'], payload);
    },
    [communicationSentAction.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['sent', 'thread', 'error'], payload);
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
          ['sent', 'thread', 'allIds'],
          payload.page > 1
            ? [...communicationSorted, ...state.sent.thread.allIds]
            : communicationSorted,
        )
        .setIn(['sent', 'thread', 'count'], payload.count)
        .setIn(['sent', 'thread', 'page'], payload.page)
        .setIn(['sent', 'thread', 'next_page'], payload.next_page);
    },
    [communicationSentAction.refresh.toString()]: (state, { payload }: any) => {
      const lastCommunicationSorted = payload.results
        .map((communication: Communication) => communication.id)
        .slice()
        .reverse();
      const previousCommunicationSorted = state.sent.thread.allIds.filter(
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
          ['sent', 'thread', 'allIds'],
          [...previousCommunicationSorted, ...lastCommunicationSorted],
        );
    },
    [communicationSentAction.reset.toString()]: (state) => {
      return state
        .setIn(['sent', 'thread', 'allIds'], [])
        .setIn(['sent', 'thread', 'next_page'], null);
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
  },
  initialState,
);
