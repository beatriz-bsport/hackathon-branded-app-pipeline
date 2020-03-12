// @flow

import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import {
  activeCampaignAccountListAction,
  activeCampaignAccountUpdateAction,
  activeCampaignAccountDeleteAction,
  activeCampaignAccountCreateAction,
  getActiveCampaignListsAction,
  activeCampaignLinksListAction,
  activeCampaignLinksUpdateAction,
  activeCampaignLinksDeleteAction,
  activeCampaignLinksCreateAction,
  getActiveCampaignWebhooksAction,
} from './actions';

const initialState: active_campaign_state = Immutable({
  account: {
    loading: false,
    item: null,
    // Create or Update
    upsert: {
      loading: false,
      error: null,
    },
    webhooks: {
      items: [],
      loading: false,
    },
  },
  links: {
    loading: false,
    byId: {},
    allIds: [],
    // Create or Update
    upsert: {
      loading: false,
      error: null,
    },
    lists: [],
    listsLoading: false,
    listsError: null,
  },
});

export default handleActions(
  {
    [activeCampaignAccountListAction.success]: (state, { payload }) => {
      return state.setIn(['account', 'item'], payload[0]);
    },
    [activeCampaignAccountListAction.error]: (state, { payload }) => {
      return state.setIn(['account', 'error'], payload);
    },
    [activeCampaignAccountListAction.isLoading]: (state, { payload }) => {
      return state.setIn(['account', 'loading'], payload);
    },
    [activeCampaignAccountCreateAction.isLoading]: (state, { payload }) => {
      return state.setIn(['account', 'upsert', 'loading'], payload);
    },
    [activeCampaignAccountCreateAction.success]: (state, { payload }) => {
      return state.setIn(['account', 'item'], payload);
    },
    [activeCampaignAccountCreateAction.error]: (state, { payload }) => {
      return state.setIn(['account', 'upsert', 'error'], payload);
    },
    [activeCampaignAccountUpdateAction.success]: (state, { payload }) => {
      return state.setIn(['account', 'item'], payload);
    },

    [activeCampaignAccountUpdateAction.isLoading]: (state, { payload }) => {
      return state.setIn(['account', 'loading'], payload);
    },
    [activeCampaignAccountUpdateAction.error]: (state, { payload }) => {
      return state.setIn(['account', 'error'], payload);
    },
    [activeCampaignAccountDeleteAction.isLoading]: (state, { payload }) => {
      return state.setIn(['account', 'loading'], payload);
    },
    [activeCampaignAccountDeleteAction.error]: (state, { payload }) => {
      return state.setIn(['account', 'error'], payload);
    },
    [activeCampaignAccountDeleteAction.success]: (state, { payload }) => {
      return state
        .updateIn(['byId'], (x) => x.without(`${payload}`))
        .updateIn(
          'allIds',
          (myList, removeId) => {
            const newList = myList.filter((id) => id !== removeId);
            return newList;
          },
          payload,
        );
    },

    // links
    [activeCampaignLinksListAction.success]: (state, { payload }) => {
      return state
        .merge(
          {
            links: {
              byId: payload.linksDict,
            },
          },
          { deep: true },
        )
        .setIn(['links', 'allIds'], payload.linksIdList);
    },
    [activeCampaignLinksListAction.error]: (state, { payload }) => {
      return state.setIn(['links', 'error'], payload);
    },
    [activeCampaignLinksListAction.isLoading]: (state, { payload }) => {
      return state.setIn(['links', 'loading'], payload);
    },
    [activeCampaignLinksCreateAction.isLoading]: (state, { payload }) => {
      return state.setIn(['links', 'upsert', 'loading'], payload);
    },
    [activeCampaignLinksCreateAction.success]: (state, { payload }) => {
      return state
        .merge(
          {
            links: { byId: { [payload.id]: payload } },
          },
          { deep: true },
        )
        .updateIn(
          ['links', 'allIds'],
          (myList, newId) => {
            return myList.concat([newId]);
          },
          payload.id,
        );
    },
    [activeCampaignLinksCreateAction.error]: (state, { payload }) => {
      return state.setIn(['links', 'upsert', 'error'], payload);
    },
    [getActiveCampaignListsAction.success]: (state, { payload }) => {
      return state.setIn(['links', 'lists'], payload);
    },
    [getActiveCampaignListsAction.isLoading]: (state, { payload }) => {
      return state.setIn(['links', 'listsLoading'], payload);
    },
    [getActiveCampaignListsAction.error]: (state, { payload }) => {
      return state.setIn(['links', 'listsError'], payload);
    },
    [activeCampaignLinksUpdateAction.success]: (state, { payload }) => {
      return state.merge(
        { links: { byId: { [payload.id]: payload } } },
        { deep: true },
      );
    },

    [activeCampaignLinksUpdateAction.isLoading]: (state, { payload }) => {
      return state.setIn(['links', 'loading'], payload);
    },
    [activeCampaignLinksUpdateAction.error]: (state, { payload }) => {
      return state.setIn(['links', 'error'], payload);
    },
    [activeCampaignLinksDeleteAction.isLoading]: (state, { payload }) => {
      return state.setIn(['links', 'loading'], payload);
    },
    [activeCampaignLinksDeleteAction.error]: (state, { payload }) => {
      return state.setIn(['links', 'error'], payload);
    },
    [activeCampaignLinksDeleteAction.success]: (state, { payload }) => {
      return state
        .updateIn(['links', 'byId'], (x) => x.without(`${payload}`))
        .updateIn(
          ['links', 'allIds'],
          (myList, removeId) => {
            const newList = myList.filter((id) => id !== removeId);
            return newList;
          },
          payload,
        );
    },
    // webhooks
    [getActiveCampaignWebhooksAction.error]: (state, { payload }) => {
      return state.setIn(['account', 'webhooks', 'error'], payload);
    },
    [getActiveCampaignWebhooksAction.success]: (state, { payload }) => {
      return state.setIn(['account', 'webhooks', 'items'], payload);
    },
    [getActiveCampaignWebhooksAction.isLoading]: (state, { payload }) => {
      return state.setIn(['account', 'webhooks', 'loading'], payload);
    },
  },
  initialState,
);
