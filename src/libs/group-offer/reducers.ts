import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';

import {
  fetchGroupsOfferListActions,
  generateGroupOffersPreviewActions,
  fetchGroupOfferActions,
  groupOfferseditGroupOfferActions,
  fetchSimilarGroupOffersActions,
  deleteGroupOfferActions,
  fetchExistingGroupOfferActions,
  fetchGroupsOfferBulkActions,
  getGroupOfferFirstOfferIdToBeBookedActions,
  listGroupOfferOffersIdsToBeBookedActions,
  getGroupOfferBookableStatusActions,
} from './actions';
import { GroupOfferState } from './types';
import { OfferStatus } from '#libs/offer/types';

const initialState: Immutable.Immutable<GroupOfferState> =
  Immutable<GroupOfferState>({
    byId: {},
    allIds: [],
    count: 0,
    loading: false,
    error: null,
    preview: {
      loading: false,
      error: null,
      groups: {},
    },
    retrieve: {
      loading: false,
      error: null,
      id: null,
    },
    editing: {
      loading: false,
      error: null,
    },
    similar: {
      loading: false,
      error: null,
      allIds: [],
    },
    delete: {
      loading: false,
      error: null,
    },
    existing: {
      loading: false,
      error: null,
      exist: false,
    },
    offersStatus: {
      byId: {},
      error: null,
      loading: false,
    },
    offersIdsToBeBooked: {
      loading: false,
      error: null,
      allIds: [],
      byGroupId: {},
    },
  });

export default handleActions<Immutable.Immutable<GroupOfferState>, any>(
  {
    [fetchGroupsOfferListActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['allIds'],
          payload.results.map((go) => go.id),
        )
        .setIn(['count'], payload.count)
        .merge(
          {
            byId: payload.results.reduce((acc, go) => {
              acc[go.id] = go;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [fetchGroupsOfferListActions.loading.toString()]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [fetchGroupsOfferListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [fetchGroupsOfferBulkActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.reduce((acc, go) => {
            acc[go.id] = go;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [fetchGroupsOfferBulkActions.loading.toString()]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [fetchGroupsOfferBulkActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },

    [fetchGroupOfferActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'id'], payload.id).merge(
        {
          byId: {
            [payload.id]: payload,
          },
        },
        { deep: true },
      );
    },
    [fetchGroupOfferActions.loading.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'loading'], payload);
    },
    [fetchGroupOfferActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'error'], payload);
    },
    [fetchGroupOfferActions.reset.toString()]: (state) => {
      return state.setIn(['retrieve', 'id'], null);
    },
    [generateGroupOffersPreviewActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          preview: {
            groups: payload,
          },
        },
        { deep: true },
      );
    },
    [groupOfferseditGroupOfferActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['loading', 'loading'], payload);
    },
    [groupOfferseditGroupOfferActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['loading', 'error'], payload);
    },
    [groupOfferseditGroupOfferActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          byId: {
            [payload.id]: payload,
          },
        },
        { deep: true },
      );
    },
    [generateGroupOffersPreviewActions.reset.toString()]: (state) => {
      return state.setIn(['preview'], {
        loading: false,
        error: null,
        groups: {},
      });
    },
    [generateGroupOffersPreviewActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['preview', 'loading'], payload);
    },
    [generateGroupOffersPreviewActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['preview', 'error'], payload);
    },
    [fetchSimilarGroupOffersActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['similar', 'loading'], payload);
    },
    [fetchSimilarGroupOffersActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['similar', 'error'], payload);
    },
    [fetchSimilarGroupOffersActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['similar', 'allIds'],
          payload.map((p) => p.id),
        )
        .merge(
          {
            byId: payload.reduce((acc, go) => {
              acc[go.id] = go;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [deleteGroupOfferActions.loading.toString()]: (state, { payload }) => {
      return state.setIn(['delete', 'loading'], payload);
    },
    [deleteGroupOfferActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['delete', 'error'], payload);
    },
    [fetchExistingGroupOfferActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['existing', 'loading'], payload);
    },
    [fetchExistingGroupOfferActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['existing', 'error'], payload);
    },
    [fetchExistingGroupOfferActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['existing', 'exist'], !!payload);
    },
    [getGroupOfferFirstOfferIdToBeBookedActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [listGroupOfferOffersIdsToBeBookedActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['offersIdsToBeBooked', 'loading'], payload);
    },
    [listGroupOfferOffersIdsToBeBookedActions.success.toString()]: (
      state,
      { payload }: { payload: { groupId: number; offersIds: number[] } },
    ) => {
      return state
        .setIn(
          ['offersIdsToBeBooked', 'byGroupId', payload.groupId],
          payload.offersIds,
        )
        .setIn(
          ['offersIdsToBeBooked', 'allIds'],
          uniq([...state.offersIdsToBeBooked.allIds, ...payload.offersIds]),
        );
    },
    [listGroupOfferOffersIdsToBeBookedActions.reset.toString()]: (state) => {
      return state
        .setIn(['offersIdsToBeBooked', 'loading'], false)
        .setIn(['offersIdsToBeBooked', 'allIds'], [])
        .setIn(['offersIdsToBeBooked', 'byGroupId'], {});
    },
    [getGroupOfferBookableStatusActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [getGroupOfferBookableStatusActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number; data: OfferStatus[] } },
    ) => {
      return state.setIn(
        ['offersStatus', 'byId', payload.id],
        payload.data.reduce<{ [id: number]: OfferStatus }>((acc, cV) => {
          acc[cV.id] = cV;
          return acc;
        }, {}),
      );
    },
  },
  initialState,
);
