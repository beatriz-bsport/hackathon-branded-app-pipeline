// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';

import {
  smartListListAction,
  smartListDetailAction,
  updateSmartListAction,
  createSmartListAction,
  deleteSmartListAction,
  fetchSmartListFiltersAction,
  filterUpdateAction,
  filterCreateAction,
  filterDeleteAction,
  smartListBulkAction,
} from './actions';

const initialState: smart_list_state = Immutable({
  loading: false,
  error: null,
  byId: {},
  allIds: [],
  filtersByCategoryId: {},
  // Create or Update
  upsert: {
    loading: false,
    error: null,
  },
  filter: {
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [smartListListAction.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.smartListDict,
          },
          { deep: true },
        )
        .set('allIds', payload.smartListIdList);
    },
    [smartListListAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [smartListListAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [smartListBulkAction.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.smartListDict,
          },
          { deep: true },
        )
        .set('allIds', payload.smartListIdList);
    },
    [smartListBulkAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [smartListBulkAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [smartListDetailAction.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload,
        },
        { deep: true },
      );
    },
    [smartListDetailAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [smartListDetailAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },

    [createSmartListAction.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: { [payload.id]: payload },
          },
          { deep: true },
        )
        .update(
          'allIds',
          (myList, newId) => {
            return myList.concat([newId]);
          },
          payload.id,
        );
    },
    [createSmartListAction.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [createSmartListAction.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [updateSmartListAction.success]: (state, { payload }) => {
      return state.merge({ byId: { [payload.id]: payload } }, { deep: true });
    },

    [updateSmartListAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [updateSmartListAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [deleteSmartListAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [deleteSmartListAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [deleteSmartListAction.success]: (state, { payload }) => {
      return state
        .updateIn(['byId'], (x) => x.without(`${payload}`))
        .update(
          'allIds',
          (myList, removeId) => {
            const newList = myList.filter((id) => id !== removeId);
            return newList;
          },
          payload,
        );
    },

    // Smart List specific actions
    [fetchSmartListFiltersAction.success]: (state, { payload }) => {
      return state.merge(
        {
          filtersByCategoryId: payload,
        },
        { deep: true },
      );
    },
    [fetchSmartListFiltersAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchSmartListFiltersAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    // Filters actions

    [filterCreateAction.success]: (state, { payload }) => {
      return state.merge(
        {
          filtersByCategoryId: {
            [payload.filter_identifier]: {
              [payload.filter.id]: payload.filter,
            },
          },
        },
        { deep: true },
      );
    },
    [filterCreateAction.isLoading]: (state, { payload }) => {
      return state.setIn(['filter', 'loading'], payload);
    },
    [filterCreateAction.error]: (state, { payload }) => {
      return state.setIn(['filter', 'error'], payload);
    },
    [filterUpdateAction.success]: (state, { payload }) => {
      return state.merge(
        {
          filtersByCategoryId: {
            [payload.filter_identifier]: {
              [payload.filter.id]: payload.filter,
            },
          },
        },
        { deep: true },
      );
    },

    [filterUpdateAction.isLoading]: (state, { payload }) => {
      return state.setIn(['filter', 'loading'], payload);
    },
    [filterUpdateAction.error]: (state, { payload }) => {
      return state.setIn(['filter', 'error'], payload);
    },
    [filterDeleteAction.success]: (state, { payload }) => {
      return state.updateIn(
        ['filtersByCategoryId', payload.filter_identifier],
        (x) => x.without(`${payload.id}`),
      );
    },
    [filterDeleteAction.isLoading]: (state, { payload }) => {
      return state.setIn(['filter', 'loading'], payload);
    },
    [filterDeleteAction.error]: (state, { payload }) => {
      return state.setIn(['filter', 'error'], payload);
    },
  },
  initialState,
);
