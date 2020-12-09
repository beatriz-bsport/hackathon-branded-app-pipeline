// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrieveVideoActions,
  listVideoActions,
  createOrUpdateVideoActions,
  bulkVideoActions,
  searchVideoActions,
  listVideoPurchaseActions,
  retrieveVideoAnalyticsActions,
  listVideoViewsActions,
  listVideoFilterableParamsActions,
} from './actions';

const initialState = Immutable({
  byId: {},
  list: {
    page: null,
    allIds: [],
    nextPage: 1,
  },
  loading: false,
  error: null,
  createOrUpdate: {
    loading: false,
    error: null,
  },
  updateItem: {
    loading: false,
    error: null,
  },
  search: {
    loading: false,
    error: null,
    nextPage: 1,
    allIds: [],
  },
  purchase: {
    loading: false,
    error: null,
    items: [],
    page: 1,
    count: 0,
  },
  analytics: {
    loading: false,
    data: {},
    error: null,
  },
  views: {
    loading: false,
    error: null,
    items: [],
    page: 1,
    count: 0,
  },
  filterableParams: {
    items: {},
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [createOrUpdateVideoActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [createOrUpdateVideoActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [createOrUpdateVideoActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [retrieveVideoActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [bulkVideoActions.success]: (state, { payload }) => {
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
    [listVideoActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listVideoActions.reset]: (state) => {
      return state.setIn(['list', 'allIds'], []);
    },
    [listVideoActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [listVideoActions.success]: (state, { payload }) => {
      const newAllIds =
        payload.page === 1
          ? payload.results.map((v) => v.id)
          : [...state.list.allIds, ...payload.results.map((v) => v.id)];
      return state
        .merge(
          {
            byId: payload.results.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(['list', 'allIds'], newAllIds)
        .setIn(['list', 'page'], payload.page)
        .setIn(['list', 'nextPage'], payload.next_page);
    },
    [searchVideoActions.isLoading]: (state, { payload }) => {
      return state.setIn(['search', 'loading'], payload);
    },
    [searchVideoActions.error]: (state, { payload }) => {
      return state.setIn(['search', 'error'], payload);
    },
    [searchVideoActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.results.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(['search', 'allIds'], payload.results.map((v) => v.id))
        .setIn(['search', 'page'], payload.page)
        .setIn(['search', 'nextPage'], payload.next_page);
    },
    [listVideoPurchaseActions.isLoading]: (state, { payload }) => {
      return state.setIn(['purchase', 'loading'], payload);
    },
    [listVideoPurchaseActions.error]: (state, { payload }) => {
      return state.setIn(['purchase', 'error'], payload);
    },
    [listVideoPurchaseActions.success]: (state, { payload }) => {
      return state
        .setIn(['purchase', 'page'], payload.page)
        .setIn(['purchase', 'count'], payload.count)
        .setIn(['purchase', 'items'], payload.results);
    },
    [retrieveVideoAnalyticsActions.isLoading]: (state, { payload }) => {
      return state.setIn(['analytics', 'loading'], payload);
    },
    [retrieveVideoAnalyticsActions.error]: (state, { payload }) => {
      return state.setIn(['analytics', 'error'], payload);
    },
    [retrieveVideoAnalyticsActions.success]: (state, { payload }) => {
      return state.setIn(['analytics', 'data'], payload);
    },
    [listVideoViewsActions.isLoading]: (state, { payload }) => {
      return state.setIn(['views', 'loading'], payload);
    },
    [listVideoViewsActions.error]: (state, { payload }) => {
      return state.setIn(['views', 'error'], payload);
    },
    [listVideoViewsActions.success]: (state, { payload }) => {
      return state
        .setIn(['views', 'page'], payload.page)
        .setIn(['views', 'count'], payload.count)
        .setIn(['views', 'items'], payload.results);
    },
    [listVideoFilterableParamsActions.isLoading]: (state, { payload }) => {
      return state.setIn(['filterableParams', 'loading'], payload);
    },
    [listVideoFilterableParamsActions.error]: (state, { payload }) => {
      return state.setIn(['filterableParams', 'error'], payload);
    },
    [listVideoFilterableParamsActions.success]: (state, { payload }) => {
      return state.setIn(['filterableParams', 'items'], payload);
    },
  },
  initialState,
);
