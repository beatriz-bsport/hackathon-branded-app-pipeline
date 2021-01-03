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

const initialState = Immutable({
  byId: {},
  allIds: [],
  loading: false,
  error: false,
  favorite: {
    id: null,
    loading: false,
    error: null,
  },
  errorMsg: '',
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

export default handleActions(
  {
    [favoriteActions.isLoading]: (state, { payload }) => {
      return state.setIn(['favorite', 'loading'], payload);
    },
    [favoriteActions.error]: (state, { payload }) => {
      return state.setIn(['favorite', 'error'], payload);
    },
    [favoriteActions.success]: (state, { payload }) => {
      if (payload) {
        return state
          .setIn(['favorite', 'id'], payload.id)
          .setIn(['byId', payload.id], payload);
      }
      return state.setIn(['favorite', 'id'], null);
    },
    [deleteAction.isLoading]: (state, { payload }) => {
      return state.setIn(['delete', 'loading'], payload);
    },
    [deleteAction.error]: (state, { payload }) => {
      return state.setIn(['delete', 'error'], payload);
    },
    [metaActivityListActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [metaActivityListActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityListActions.success]: (state, { payload }) => {
      return state
        .set(
          'allIds',
          payload.map((ma) => ma.id),
        )
        .merge(
          {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [metaActivityDetailActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [metaActivityDetailActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityDetailActions.success]: (state, { payload }) => {
      return state.merge({ byId: payload }, { deep: true });
    },
    [metaActivityBulkActions.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [metaActivityBulkActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [addImage.success]: (state, { payload }) => {
      const { image } = payload.image;
      const { images } = state.byId[payload.id];
      return state.setIn(
        ['byId', payload.id, 'images'],
        [image].concat(images),
      );
    },
    [removeImage.success]: (state, { payload }) => {
      const images = state.byId[payload.id].images.filter(
        (i) => i.id !== payload.imageId,
      );
      return state.setIn(['byId', payload.id, 'images'], images);
    },
    [upsertActions.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertActions.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [upsertActions.success]: (state, { payload }) => {
      return state
        .setIn(['byId', payload.id], payload)
        .setIn(['upsert', 'data'], payload);
    },
    [listingActions.success]: (state, { payload }) => {
      return state
        .set(
          'allIds',
          payload.map((ma) => ma.id),
        )
        .merge(
          {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [listingActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listingActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityRestoreActions.isLoading]: (state, { payload }) => {
      return state.set('error', payload);
    },
  },
  initialState,
);
