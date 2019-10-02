// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  listingActions,
  upsertActions,
  addImage,
  removeImage,
  deleteAction,
} from '../actions/workshop-activity.actions';

const initialState = Immutable({
  loading: false,
  error: null,
  byId: {},
  allIds: [],
  delete: {
    loading: false,
    error: null,
  },
  upsert: {
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
    [listingActions.success]: (state, { payload }) => {
      return state
        .merge({ byId: payload.workshopActivitiesDict }, { deep: true })
        .set('allIds', payload.idList);
    },
    [listingActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listingActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [upsertActions.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertActions.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [upsertActions.success]: (state, { payload }) => {
      return state
        .merge({ byId: payload.workshopActivity }, { deep: true })
        .setIn(['upsert', 'data'], Object.values(payload.workshopActivity)[0]);
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
  },
  initialState,
);
