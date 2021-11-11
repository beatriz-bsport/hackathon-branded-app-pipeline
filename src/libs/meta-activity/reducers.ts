// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  metaActivityListActions,
  metaActivityDetailActions,
  removeImage,
  addImage,
  upsertActions,
  deleteAction,
  listingActions,
  metaActivityBulkActions,
  favoriteActions,
  metaActivityRestoreActions,
} from './actions';
import { MetaActivity, MetaActivityState } from './types';

const initialState: Immutable.Immutable<MetaActivityState> =
  Immutable<MetaActivityState>({
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    favorite: {
      id: null,
      loading: false,
      error: null,
    },
    delete: {
      loading: false,
      error: null,
    },
    upsert: {
      data: null,
      loading: false,
      error: null,
    },
  });

export default handleActions<Immutable.Immutable<MetaActivityState>, any>(
  {
    [favoriteActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['favorite', 'loading'], payload);
    },
    [favoriteActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['favorite', 'error'], payload);
    },
    [favoriteActions.success.toString()]: (state, { payload }) => {
      if (payload) {
        return state
          .setIn(['favorite', 'id'], payload.id)
          .setIn(['byId', payload.id], payload);
      }
      return state.setIn(['favorite', 'id'], null);
    },
    [deleteAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['delete', 'loading'], payload);
    },
    [deleteAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['delete', 'error'], payload);
    },
    [metaActivityListActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [metaActivityListActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityListActions.success.toString()]: (
      state,
      { payload }: { payload: MetaActivity[] },
    ) => {
      return state
        .set(
          'allIds',
          payload.map((ma: MetaActivity) => ma.id),
        )
        .merge(
          {
            byId: payload.reduce(
              (acc: MetaActivityState['byId'], ps: MetaActivity) => {
                acc[ps.id] = ps;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        );
    },
    [metaActivityDetailActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [metaActivityDetailActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityDetailActions.success.toString()]: (state, { payload }) => {
      return state.merge({ byId: payload }, { deep: true });
    },
    [metaActivityBulkActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.reduce(
            (acc: MetaActivityState['byId'], ps: MetaActivity) => {
              acc[ps.id] = ps;
              return acc;
            },
            {},
          ),
        },
        { deep: true },
      );
    },
    [metaActivityBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [addImage.success.toString()]: (state, { payload }) => {
      const { image } = payload.image;
      const { images } = state.byId[payload.id];
      return state.setIn(
        ['byId', payload.id, 'images'],
        [image].concat(images),
      );
    },
    [removeImage.success.toString()]: (state, { payload }) => {
      const images = state.byId[payload.id].images.filter(
        (i) => i.id !== payload.imageId,
      );
      return state.setIn(['byId', payload.id, 'images'], images);
    },
    [upsertActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [upsertActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['byId', payload.id], payload)
        .setIn(['upsert', 'data'], payload);
    },
    [listingActions.success.toString()]: (state, { payload }) => {
      return state
        .set(
          'allIds',
          payload.map((ma: MetaActivity) => ma.id),
        )
        .merge(
          {
            byId: payload.reduce(
              (acc: MetaActivityState['byId'], ps: MetaActivity) => {
                acc[ps.id] = ps;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        );
    },
    [listingActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listingActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityRestoreActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
  },
  initialState,
);
