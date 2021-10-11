// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  listGiftcardActions,
  retrieveGiftcardActions,
  retrieveConsumerGiftcardActions,
  attributeToMemberActions,
  listConsumerGiftcardActions,
  listConsumerGiftcardSentActions,
  listConsumerGiftcardReceivedActions,
  createOrUpdateGiftcardActions,
  deleteGiftcardActions,
  sendEmailInvitationActions,
  listGiftcardBackgroundImageActions,
  createGiftcardBackgroundImageActions,
  deleteGiftcardBackgroundImageActions,
  restoreGiftcardActions,
  listBulkGiftcardActions,
} from './actions';

import type {
  GiftcardState,
  Giftcard,
  ConsumerGiftcard,
  GiftcardBackgroundImage,
} from './types';

const initialState: Immutable.Immutable<GiftcardState> = Immutable<GiftcardState>(
  {
    giftcard: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    consumerGiftcard: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      count: 0,
      page: 1,
      asReceiver: {
        allIds: [],
        loading: false,
        error: null,
        count: 0,
        page: 1,
      },
      asSender: {
        allIds: [],
        loading: false,
        error: null,
        count: 0,
        page: 1,
      },
    },
    giftcardBackgroundImage: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
  },
);

export default handleActions(
  {
    [listGiftcardActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['giftcard', 'loading'], payload);
    },
    [listGiftcardActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['giftcard', 'error'], payload);
    },
    [retrieveGiftcardActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['giftcard', 'byId', payload.id], payload);
    },
    [retrieveConsumerGiftcardActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['consumerGiftcard', 'byId', payload.id], payload);
    },
    [deleteGiftcardActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['giftcard', 'byId', payload.id], payload);
    },
    [restoreGiftcardActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['giftcard', 'byId', payload.id], payload);
    },
    [createOrUpdateGiftcardActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcard', 'byId', payload.id], payload);
    },
    [listGiftcardActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['giftcard', 'allIds'],
          payload.map((g) => g.id),
        )
        .merge(
          {
            giftcard: {
              byId: payload.reduce((acc: { [id: number]: Giftcard }, g) => {
                acc[g.id] = g;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [attributeToMemberActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['consumerGiftcard', 'byId', payload.id], payload);
    },
    [sendEmailInvitationActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['consumerGiftcard', 'byId', payload.id], payload);
    },
    [listConsumerGiftcardActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['consumerGiftcard', 'loading'], payload);
    },
    [listConsumerGiftcardActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['consumerGiftcard', 'error'], payload);
    },
    [listConsumerGiftcardActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['consumerGiftcard', 'allIds'],
          payload.results.map((g) => g.id),
        )
        .setIn(['consumerGiftcard', 'page'], payload.page)
        .setIn(['consumerGiftcard', 'count'], payload.count)
        .merge(
          {
            consumerGiftcard: {
              byId: payload.results.reduce(
                (acc: { [id: number]: ConsumerGiftcard }, g) => {
                  acc[g.id] = g;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [listGiftcardBackgroundImageActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardBackgroundImage', 'loading'], payload);
    },
    [listGiftcardBackgroundImageActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardBackgroundImage', 'loading'], payload);
    },
    [listGiftcardBackgroundImageActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['giftcardBackgroundImage', 'allIds'],
          payload.map((g) => g.id),
        )
        .merge(
          {
            giftcardBackgroundImage: {
              byId: payload.reduce(
                (acc: { [id: number]: GiftcardBackgroundImage }, g) => {
                  acc[g.id] = g;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [createGiftcardBackgroundImageActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['giftcardBackgroundImage', 'allIds'],
          [payload.id, ...state.giftcardBackgroundImage.allIds],
        )
        .setIn(['giftcardBackgroundImage', 'byId', payload.id], payload);
    },
    [deleteGiftcardBackgroundImageActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['giftcardBackgroundImage', 'allIds'],
        state.giftcardBackgroundImage.allIds.filter(
          (gbi) => gbi.id !== payload,
        ),
      );
    },
    [listConsumerGiftcardSentActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['consumerGiftcard', 'asSender', 'loading'], payload);
    },
    [listConsumerGiftcardSentActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['consumerGiftcard', 'asSender', 'error'], payload);
    },
    [listConsumerGiftcardSentActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['consumerGiftcard', 'asSender', 'allIds'],
          payload.results.map((g) => g.id),
        )
        .setIn(['consumerGiftcard', 'asSender', 'page'], payload.page)
        .setIn(['consumerGiftcard', 'asSender', 'count'], payload.count)
        .merge(
          {
            consumerGiftcard: {
              byId: payload.results.reduce(
                (acc: { [id: number]: ConsumerGiftcard }, g) => {
                  acc[g.id] = g;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [listConsumerGiftcardReceivedActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['consumerGiftcard', 'asReceiver', 'loading'],
        payload,
      );
    },
    [listConsumerGiftcardReceivedActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['consumerGiftcard', 'asReceiver', 'error'], payload);
    },
    [listConsumerGiftcardReceivedActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['consumerGiftcard', 'asReceiver', 'allIds'],
          payload.results.map((g) => g.id),
        )
        .setIn(['consumerGiftcard', 'asReceiver', 'page'], payload.page)
        .setIn(['consumerGiftcard', 'asReceiver', 'count'], payload.count)
        .merge(
          {
            consumerGiftcard: {
              byId: payload.results.reduce(
                (acc: { [id: number]: ConsumerGiftcard }, g) => {
                  acc[g.id] = g;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [listBulkGiftcardActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['giftcard', 'loading'], payload);
    },
    [listBulkGiftcardActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['giftcard', 'error'], payload);
    },
    [listBulkGiftcardActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          giftcard: {
            byId: payload.reduce((acc: { [id: number]: Giftcard }, g) => {
              acc[g.id] = g;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
  },
  initialState,
);
