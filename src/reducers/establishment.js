// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  listIsLoading,
  listLoaded,
  listError,
  upsertIsLoading,
  upsertError,
  actionStartUpdate,
  addImage,
  removeImage,
} from '../actions/establishment.actions';

const initialState = Immutable({
  all: [],
  loading: false,
  error: null,
  // Create or Update
  upsert: {
    loading: false,
    error: null,
  },
  // Update
  updated: null,
});

export default handleActions(
  {
    [listIsLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listLoaded]: (state, { payload }) => {
      return state.set('all', payload);
    },
    [listError]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [upsertIsLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertError]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [actionStartUpdate]: (state, { payload }) => {
      return state.set('updated', payload);
    },
    [addImage.isLoading]: (state, { payload }) => {
      const index = state.all.findIndex((e) => e.id === payload.id);
      return state.setIn(['all', index, 'loading'], payload.loading);
    },
    [addImage.success]: (state, { payload }) => {
      const { id, image } = payload;
      const index = state.all.findIndex((e) => e.id === id);
      const { images } = state.all[index];
      return state.setIn(['all', index, 'images'], [image].concat(images));
    },
    [removeImage.isLoading]: (state, { payload }) => {
      const index = state.all.findIndex((e) => e.id === payload.id);
      const establishment = state.all[index];
      const iImage = establishment.images.findIndex(
        (i) => i.id === payload.imageId,
      );
      return state.setIn(
        ['all', index, 'images', iImage, 'deleting'],
        payload.loading,
      );
    },
    [removeImage.success]: (state, { payload }) => {
      const index = state.all.findIndex((e) => e.id === payload.id);
      const establishment = state.all[index];
      const images = establishment.images.filter(
        (i) => i.id !== payload.imageId,
      );
      console.log(images);
      return state.setIn(['all', index, 'images'], images);
    },
  },
  initialState,
);
