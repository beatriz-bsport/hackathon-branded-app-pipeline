import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import type {
  ActiveCampaignState,
  Account,
  LinksPayload,
  LinkApi,
  ActiveCampaignList,
  ActiveCampaignWebhook,
} from './types';
import {
  activeCampaignAccountListAction,
  activeCampaignAccountUpdateAction,
  activeCampaignAccountCreateAction,
  getActiveCampaignListsAction,
  activeCampaignLinksListAction,
  activeCampaignLinksUpdateAction,
  activeCampaignLinksDeleteAction,
  activeCampaignLinksCreateAction,
  getActiveCampaignWebhooksAction,
} from './actions';

const initialState: Immutable.Immutable<ActiveCampaignState> =
  Immutable<ActiveCampaignState>({
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

export default handleActions<Immutable.Immutable<ActiveCampaignState>, any>(
  {
    [activeCampaignAccountListAction.success.toString()]: (
      state,
      { payload }: { payload: Account[] },
    ) => {
      return state.setIn(['account', 'item'], payload[0]);
    },
    [activeCampaignAccountListAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['account', 'error'], payload);
    },
    [activeCampaignAccountListAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['account', 'loading'], payload);
    },
    [activeCampaignAccountCreateAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['account', 'upsert', 'loading'], payload);
    },
    [activeCampaignAccountCreateAction.success.toString()]: (
      state,
      { payload }: { payload: Account },
    ) => {
      return state.setIn(['account', 'item'], payload);
    },
    [activeCampaignAccountCreateAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['account', 'upsert', 'error'], payload);
    },
    [activeCampaignAccountUpdateAction.success.toString()]: (
      state,
      { payload }: { payload: Account },
    ) => {
      return state.setIn(['account', 'item'], payload);
    },

    [activeCampaignAccountUpdateAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['account', 'loading'], payload);
    },
    [activeCampaignAccountUpdateAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['account', 'error'], payload);
    },

    // links
    [activeCampaignLinksListAction.success.toString()]: (
      state,
      { payload }: { payload: LinksPayload },
    ) => {
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
    [activeCampaignLinksListAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['links', 'error'], payload);
    },
    [activeCampaignLinksListAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['links', 'loading'], payload);
    },
    [activeCampaignLinksCreateAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['links', 'upsert', 'loading'], payload);
    },
    [activeCampaignLinksCreateAction.success.toString()]: (
      state,
      { payload }: { payload: LinkApi },
    ) => {
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
    [activeCampaignLinksCreateAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['links', 'upsert', 'error'], payload);
    },
    [getActiveCampaignListsAction.success.toString()]: (
      state,
      { payload }: { payload: ActiveCampaignList[] },
    ) => {
      return state.setIn(['links', 'lists'], payload);
    },
    [getActiveCampaignListsAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['links', 'listsLoading'], payload);
    },
    [getActiveCampaignListsAction.error.toString()]: (
      state,
      { payload }: { payload: number | null },
    ) => {
      return state.setIn(['links', 'listsError'], payload);
    },
    [activeCampaignLinksUpdateAction.success.toString()]: (
      state,
      { payload }: { payload: LinkApi },
    ) => {
      return state.merge(
        { links: { byId: { [payload.id]: payload } } },
        { deep: true },
      );
    },

    [activeCampaignLinksUpdateAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['links', 'loading'], payload);
    },
    [activeCampaignLinksUpdateAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['links', 'error'], payload);
    },
    [activeCampaignLinksDeleteAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['links', 'loading'], payload);
    },
    [activeCampaignLinksDeleteAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['links', 'error'], payload);
    },
    [activeCampaignLinksDeleteAction.success.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state
        .updateIn(['links', 'byId'], (x) => x.without(payload))
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
    [getActiveCampaignWebhooksAction.error.toString()]: (
      state,
      { payload }: { payload: number | null },
    ) => {
      return state.setIn(['account', 'webhooks', 'error'], payload);
    },
    [getActiveCampaignWebhooksAction.success.toString()]: (
      state,
      { payload }: { payload: ActiveCampaignWebhook[] },
    ) => {
      return state.setIn(['account', 'webhooks', 'items'], payload);
    },
    [getActiveCampaignWebhooksAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['account', 'webhooks', 'loading'], payload);
    },
  },
  initialState,
);
