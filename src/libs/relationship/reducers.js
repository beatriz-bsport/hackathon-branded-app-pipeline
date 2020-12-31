// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  memberRelationListActions,
  memberRelationCreateOrUpdateActions,
  sharedConsumerPackListActions,
  sharedConsumerPackCreateOrUpdateActions,
  sharedPrivateConsumerPassListActions,
  sharedPrivateConsumerPassCreateOrUpdateActions,
} from './actions';

import type { RelationshipState } from './types';

const initialState: RelationshipState = Immutable({
  member_relation: {
    loading: false,
    error: null,
    items: [],
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  consumer_payment_pack_link: {
    loading: false,
    error: null,
    items: [],
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  private_consumer_pass_link: {
    loading: false,
    error: null,
    items: [],
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
});

export default handleActions(
  {
    [memberRelationListActions.success]: (state, { payload }) => {
      return state.setIn(['member_relation', 'items'], payload);
    },
    [memberRelationListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['member_relation', 'loading'], payload);
    },
    [memberRelationListActions.error]: (state, { payload }) => {
      return state.setIn(['member_relation', 'error'], payload);
    },

    [memberRelationCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(
        ['member_relation', 'createOrUpdate', 'error'],
        payload,
      );
    },
    [memberRelationCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['member_relation', 'createOrUpdate', 'loading'],
        payload,
      );
    },

    [sharedConsumerPackListActions.success]: (state, { payload }) => {
      return state.setIn(['consumer_payment_pack_link', 'items'], payload);
    },
    [sharedConsumerPackListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['consumer_payment_pack_link', 'loading'], payload);
    },
    [sharedConsumerPackListActions.error]: (state, { payload }) => {
      return state.setIn(['consumer_payment_pack_link', 'error'], payload);
    },

    [sharedConsumerPackCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(
        ['consumer_payment_pack_link', 'createOrUpdate', 'error'],
        payload,
      );
    },
    [sharedConsumerPackCreateOrUpdateActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['consumer_payment_pack_link', 'createOrUpdate', 'loading'],
        payload,
      );
    },

    [sharedPrivateConsumerPassListActions.success]: (state, { payload }) => {
      return state.setIn(['private_consumer_pass_link', 'items'], payload);
    },
    [sharedPrivateConsumerPassListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['private_consumer_pass_link', 'loading'], payload);
    },
    [sharedPrivateConsumerPassListActions.error]: (state, { payload }) => {
      return state.setIn(['private_consumer_pass_link', 'error'], payload);
    },

    [sharedPrivateConsumerPassCreateOrUpdateActions.error]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['private_consumer_pass_link', 'createOrUpdate', 'error'],
        payload,
      );
    },
    [sharedPrivateConsumerPassCreateOrUpdateActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['private_consumer_pass_link', 'createOrUpdate', 'loading'],
        payload,
      );
    },
  },
  initialState,
);
