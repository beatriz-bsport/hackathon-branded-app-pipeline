// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  fetchAll,
  fetchOne,
  removeImage,
  addImage,
} from '../actions/meta-activity.actions';

const initialState = Immutable({
  all: [],
  loading: true,
  error: false,
  errorMsg: '',
  metaActivity: null,
});

export default handleActions(
  {
    [fetchAll.isLoading]: (state, { payload }) => {
      return state.setIn(['loading'], payload);
    },
    [fetchAll.error]: (state, { payload }) => {
      return state.setIn(['error'], payload);
    },
    [fetchAll.success]: (state, { payload }) => {
      return state.setIn(['all'], payload).setIn(['lastFetched'], new Date());
    },
    [fetchOne.success]: (state, { payload }) => {
      return state
        .setIn(['metaActivity'], payload)
        .setIn(['lastFetched'], new Date());
    },
    [addImage.success]: (state, { payload }) => {
      const { image } = payload;
      const { images } = state.metaActivity;
      return state.setIn(['metaActivity', 'images'], [image].concat(images));
    },
    [removeImage.success]: (state, { payload }) => {
      const images = state.metaActivity.images.filter(
        (i) => i.id !== payload.imageId,
      );
      console.log(images);
      return state.setIn(['metaActivity', 'images'], images);
    },
  },
  initialState,
);
