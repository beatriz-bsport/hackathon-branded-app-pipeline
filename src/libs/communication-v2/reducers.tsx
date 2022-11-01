import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import {
  sendCommunicationAction,
  recipientAction,
  communicationSentAction,
} from './actions';

import type { CommunicationState, Recipient, Communication } from './types';

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
    [communicationSentAction.reset.toString()]: (state) => {
      return state
        .setIn(['sent', 'thread', 'allIds'], [])
        .setIn(['sent', 'thread', 'next_page'], null);
    },
  },
  initialState,
);
