// @ts-nocheck
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import type { StripeReader } from './types';
import {
  createStripeReaderActions,
  fetchStripeReadersActions,
  deleteStripeReaderActions,
  editStripeReaderActions,
} from './actions';

const initialState = Immutable({
  reader: {
    byId: {},
    allIds: [],
    items: [],
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [createStripeReaderActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['reader', 'error'], payload);
    },
    [createStripeReaderActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['reader', 'loading'], payload);
    },
    [editStripeReaderActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['reader', 'error'], payload);
    },
    [editStripeReaderActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['reader', 'loading'], payload);
    },
    [fetchStripeReadersActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['reader', 'error'], payload);
    },
    [fetchStripeReadersActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['reader', 'loading'], payload);
    },
    [fetchStripeReadersActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state
        .setIn(
          ['reader', 'allIds'],
          payload.map((reader: StripeReader) => reader.id),
        )
        .setIn(
          ['reader', 'byId'],
          payload.reduce((acc: any, reader: StripeReader) => {
            acc[reader.id] = reader;
            return acc;
          }, {}),
        );
    },
    [deleteStripeReaderActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['reader', 'error'], payload);
    },
    [deleteStripeReaderActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['reader', 'loading'], payload);
    },
  },
  initialState,
);
