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
  listRelatedMembersActions,
  consumerPackLinksActions,
  listControlableMembersActions,
  fetchRelatedMembersNamesByConsumerPaymentPackLinksActions,
  fetchRelatedMembersNamesByPrivateConsumerPassLinksActions,
} from './actions';

import type {
  PrivateConsumerPassLink,
  ConsumerPaymentPackLink,
  RelationshipState,
} from './types';

const initialState: RelationshipState = Immutable({
  my_related_members: {
    list: [],
    loading: false,
    error: null,
  },

  my_controlable_members: {
    list: [],
    loading: false,
    error: null,
  },

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
    byId: {},
    // Weird naming, to insist on the fact that this allIds field should ONLY be used in my passes page of member profile.
    // Some actions just fetch consumer_payment_pack_links and put them in items field.
    allIdsMyPasses: [],
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  private_consumer_pass_link: {
    loading: false,
    error: null,
    items: [],
    byId: {},
    allIds: [],
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

    [consumerPackLinksActions.success]: (state, { payload }) => {
      return state.merge(
        {
          consumer_payment_pack_link: {
            byId: payload.reduce(
              (acc: { [id: number]: Array<ConsumerPaymentPackLink> }, curr) => {
                if (acc[curr.id]) acc[curr.src].push(curr);
                else acc[curr.src] = [curr];
                return acc;
              },
              {},
            ),
          },
        },
        { deep: true },
      );
    },
    [consumerPackLinksActions.isLoading]: (state, { payload }) => {
      return state.setIn(['consumer_payment_pack_link', 'loading'], payload);
    },
    [consumerPackLinksActions.error]: (state, { payload }) => {
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

    [listRelatedMembersActions.success]: (state, { payload }) => {
      return state.setIn(['my_related_members', 'list'], payload);
    },
    [listRelatedMembersActions.error]: (state, { payload }) => {
      return state.setIn(['my_related_members', 'error'], payload);
    },
    [listRelatedMembersActions.isLoading]: (state, { payload }) => {
      return state.setIn(['my_related_members', 'isLoading'], payload);
    },

    [listControlableMembersActions.success]: (state, { payload }) => {
      return state.setIn(['my_controlable_members', 'list'], payload);
    },
    [listControlableMembersActions.error]: (state, { payload }) => {
      return state.setIn(['my_controlable_members', 'error'], payload);
    },
    [listControlableMembersActions.isLoading]: (state, { payload }) => {
      return state.setIn(['my_controlable_members', 'isLoading'], payload);
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
    [fetchRelatedMembersNamesByConsumerPaymentPackLinksActions.error.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(['consumer_payment_pack_link', 'error'], payload);
      },
    [fetchRelatedMembersNamesByConsumerPaymentPackLinksActions.isLoading.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(['consumer_payment_pack_link', 'loading'], payload);
      },
    [fetchRelatedMembersNamesByConsumerPaymentPackLinksActions.success.toString()]:
      (state, { payload }: { payload: ConsumerPaymentPackLink[] }) => {
        return state.merge(
          {
            consumer_payment_pack_link: {
              byId: payload.reduce(
                (acc: { [id: number]: ConsumerPaymentPackLink[] }, curr) => {
                  acc[curr.id] = curr;
                  return acc;
                },
                {},
              ),
              allIdsMyPasses: payload.map(({ id }) => id),
            },
          },
          { deep: true },
        );
      },
    [fetchRelatedMembersNamesByPrivateConsumerPassLinksActions.error.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(['private_consumer_pass_link', 'error'], payload);
      },
    [fetchRelatedMembersNamesByPrivateConsumerPassLinksActions.isLoading.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(['private_consumer_pass_link', 'loading'], payload);
      },
    [fetchRelatedMembersNamesByPrivateConsumerPassLinksActions.success.toString()]:
      (state, { payload }: { payload: PrivateConsumerPassLink[] }) => {
        return state.merge(
          {
            private_consumer_pass_link: {
              byId: payload.reduce(
                (acc: { [id: number]: PrivateConsumerPassLink[] }, curr) => {
                  acc[curr.id] = curr;
                  return acc;
                },
                {},
              ),
              allIds: payload.map(({ id }) => id),
            },
          },
          { deep: true },
        );
      },
  },
  initialState,
);
