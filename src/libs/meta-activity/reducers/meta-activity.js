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
} from '../actions/meta-activity.actions';

import { metaActivityBulkActions } from '../actions/common';

const initialState = Immutable({
  byId: {},
  allIds: [],
  loading: false,
  error: false,
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
        .merge({ byId: payload.metaActivitiesDict }, { deep: true })
        .set('allIds', payload.idList);
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
        .merge({ byId: payload.metaActivity }, { deep: true })
        .setIn(['upsert', 'data'], Object.values(payload.metaActivity)[0]);
    },
  },
  initialState,
);
