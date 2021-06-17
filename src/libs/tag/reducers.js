// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  tagGroupListActions,
  tagGroupCreateOrUpdateActions,
  tagListActions,
  tagCreateOrUpdateActions,
} from './actions';

import type { TagState } from './types';

const initialState: TagState = Immutable({
  tag: {
    items: [],
    byId: {},
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
  group: {
    items: [],
    byId: {},
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
  },
});

export default handleActions(
  {
    // TAGS
    // --------
    [tagListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['tag', 'loading'], payload);
    },
    [tagListActions.error]: (state, { payload }) => {
      return state.setIn(['tag', 'error'], payload);
    },
    [tagListActions.success]: (state, { payload }) => {
      return state.setIn(['tag', 'items'], payload).merge(
        {
          tag: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [tagCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['tag', 'createOrUpdate', 'loading'], payload);
    },
    [tagCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['tag', 'createOrUpdate', 'error'], payload);
    },
    [tagCreateOrUpdateActions.success]: (state, { payload }) => {
      let idx = state.tag.items.findIndex((t) => t.id === payload.id);
      if (idx === -1) {
        idx = state.tag.items.length;
      }
      return state.setIn(['tag', 'items', idx], payload);
    },
    // GROUP
    // --------
    [tagGroupListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['group', 'loading'], payload);
    },
    [tagGroupListActions.error]: (state, { payload }) => {
      return state.setIn(['group', 'error'], payload);
    },
    [tagGroupListActions.success]: (state, { payload }) => {
      return state.setIn(['group', 'items'], payload).merge(
        {
          group: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [tagGroupCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['group', 'createOrUpdate', 'loading'], payload);
    },
    [tagGroupCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['group', 'createOrUpdate', 'error'], payload);
    },
    [tagGroupCreateOrUpdateActions.success]: (state, { payload }) => {
      let idx = state.group.items.findIndex((g) => g.id === payload.id);
      if (idx === -1) {
        idx = state.group.items.length;
      }
      return state.setIn(['group', 'items', idx], payload);
    },
  },
  initialState,
);
