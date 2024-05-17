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
  listGiftcardTemplateActions,
  createGiftcardTemplateActions,
  updateGiftcardTemplateActions,
  deleteGiftcardTemplateActions,
  retrieveGiftcardTemplateActions,
  createGiftcardTemplateInstanceActions,
  deleteGiftcardTemplateInstanceActions,
} from './actions';

import type {
  GiftcardState,
  Giftcard,
  ConsumerGiftcard,
  GiftcardBackgroundImage,
  GiftcardTemplate,
} from './types';

const initialState: Immutable.Immutable<GiftcardState> =
  Immutable<GiftcardState>({
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
    giftcardTemplate: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      list: {
        loading: false,
        error: null,
      },
      instances: {
        loading: false,
        error: null,
      },
    },
  });

export default handleActions(
  {
    [listGiftcardActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['giftcard', 'loading'], payload);
    },
    [listGiftcardActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['giftcard', 'error'], payload);
    },
    [retrieveGiftcardActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['giftcard', 'byId', payload.id], payload);
    },
    [retrieveConsumerGiftcardActions.success.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      return state.setIn(['consumerGiftcard', 'byId', payload.id], payload);
    },
    [deleteGiftcardActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['giftcard', 'byId', payload.id], payload);
    },
    [restoreGiftcardActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['giftcard', 'byId', payload.id], payload);
    },
    [createOrUpdateGiftcardActions.success.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      return state.setIn(['giftcard', 'byId', payload.id], payload);
    },
    [listGiftcardActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['giftcard', 'allIds'],
          // @ts-expect-error
          payload.map((g: Giftcard) => g.id),
        )
        .merge(
          {
            giftcard: {
              // @ts-expect-error
              byId: payload.reduce(
                (acc: { [id: number]: Giftcard }, g: Giftcard) => {
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
    [attributeToMemberActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['consumerGiftcard', 'byId', payload.id], payload);
    },
    [sendEmailInvitationActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
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
      return (
        state
          .setIn(
            ['consumerGiftcard', 'allIds'],
            // @ts-expect-error
            payload.results.map((g: ConsumerGiftcard) => g.id),
          )
          // @ts-expect-error
          .setIn(['consumerGiftcard', 'page'], payload.page)
          // @ts-expect-error
          .setIn(['consumerGiftcard', 'count'], payload.count)
          .merge(
            {
              consumerGiftcard: {
                // @ts-expect-error
                byId: payload.results.reduce(
                  (
                    acc: { [id: number]: ConsumerGiftcard },
                    g: ConsumerGiftcard,
                  ) => {
                    acc[g.id] = g;
                    return acc;
                  },
                  {},
                ),
              },
            },
            { deep: true },
          )
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
          // @ts-expect-error
          payload.map((g: GiftcardBackgroundImage) => g.id),
        )
        .merge(
          {
            giftcardBackgroundImage: {
              // @ts-expect-error
              byId: payload.reduce(
                (
                  acc: { [id: number]: GiftcardBackgroundImage },
                  g: GiftcardBackgroundImage,
                ) => {
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
      return (
        state
          .setIn(
            ['giftcardBackgroundImage', 'allIds'],
            // @ts-expect-error
            [payload.id, ...state.giftcardBackgroundImage.allIds],
          )
          // @ts-expect-error
          .setIn(['giftcardBackgroundImage', 'byId', payload.id], payload)
      );
    },
    [deleteGiftcardBackgroundImageActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['giftcardBackgroundImage', 'allIds'],
        // @ts-expect-error
        state.giftcardBackgroundImage.allIds.filter((id) => id !== payload),
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
      return (
        state
          .setIn(
            ['consumerGiftcard', 'asSender', 'allIds'],
            // @ts-expect-error
            payload.results.map((g: ConsumerGiftcard) => g.id),
          )
          // @ts-expect-error
          .setIn(['consumerGiftcard', 'asSender', 'page'], payload.page)
          // @ts-expect-error
          .setIn(['consumerGiftcard', 'asSender', 'count'], payload.count)
          .merge(
            {
              consumerGiftcard: {
                // @ts-expect-error
                byId: payload.results.reduce(
                  (
                    acc: { [id: number]: ConsumerGiftcard },
                    g: ConsumerGiftcard,
                  ) => {
                    acc[g.id] = g;
                    return acc;
                  },
                  {},
                ),
              },
            },
            { deep: true },
          )
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
      return (
        state
          .setIn(
            ['consumerGiftcard', 'asReceiver', 'allIds'],
            // @ts-expect-error
            payload.results.map((g) => g.id),
          )
          // @ts-expect-error
          .setIn(['consumerGiftcard', 'asReceiver', 'page'], payload.page)
          // @ts-expect-error
          .setIn(['consumerGiftcard', 'asReceiver', 'count'], payload.count)
          .merge(
            {
              consumerGiftcard: {
                // @ts-expect-error
                byId: payload.results.reduce(
                  // @ts-expect-error
                  (acc: { [id: number]: ConsumerGiftcard }, g) => {
                    acc[g.id] = g;
                    return acc;
                  },
                  {},
                ),
              },
            },
            { deep: true },
          )
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
            // @ts-expect-error
            byId: payload.reduce((acc: { [id: number]: Giftcard }, g) => {
              acc[g.id] = g;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [listGiftcardTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardTemplate', 'list', 'loading'], payload);
    },
    [listGiftcardTemplateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['giftcardTemplate', 'list', 'error'], payload);
    },
    [listGiftcardTemplateActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['giftcardTemplate', 'allIds'],
          // @ts-expect-error
          payload.map((gt: GiftcardTemplate) => gt.id),
        )
        .merge(
          {
            giftcardTemplate: {
              // @ts-expect-error
              byId: payload.reduce(
                (
                  acc: { [id: number]: GiftcardTemplate },
                  gt: GiftcardTemplate,
                ) => {
                  acc[gt.id] = gt;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [createGiftcardTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardTemplate', 'loading'], payload);
    },
    [createGiftcardTemplateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['giftcardTemplate', 'error'], payload);
    },
    [createGiftcardTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return (
        state
          .setIn(
            ['giftcardTemplate', 'allIds'],
            // @ts-expect-error
            [...state.giftcardTemplate.allIds, payload.id],
          )
          // @ts-expect-error
          .setIn(['giftcardTemplate', 'byId', payload.id], payload)
      );
    },
    [updateGiftcardTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      return state.setIn(['giftcardTemplate', 'byId', payload.id], payload);
    },
    [deleteGiftcardTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardTemplate', 'loading'], payload);
    },
    [deleteGiftcardTemplateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['giftcardTemplate', 'error'], payload);
    },
    [deleteGiftcardTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['giftcardTemplate', 'allIds'],
        // @ts-expect-error
        state.giftcardTemplate.allIds.filter((id: number) => id !== payload),
      );
    },
    [retrieveGiftcardTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardTemplate', 'loading'], payload);
    },
    [retrieveGiftcardTemplateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardTemplate', 'error'], payload);
    },
    [retrieveGiftcardTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      return state.setIn(['giftcardTemplate', 'byId', payload.id], payload);
    },
    [createGiftcardTemplateInstanceActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardTemplate', 'instances', 'loading'], payload);
    },
    [createGiftcardTemplateInstanceActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardTemplate', 'instances', 'error'], payload);
    },
    [deleteGiftcardTemplateInstanceActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardTemplate', 'instances', 'loading'], payload);
    },
    [deleteGiftcardTemplateInstanceActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['giftcardTemplate', 'instances', 'error'], payload);
    },
  },
  initialState,
);
