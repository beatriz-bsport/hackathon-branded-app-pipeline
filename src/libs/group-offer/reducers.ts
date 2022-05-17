import Immutable from 'seamless-immutable';
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
} from './actions';
import { GroupOfferState } from './types';

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
  },
  initialState,
);
