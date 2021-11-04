import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrieveVideoActions,
  listVideoActions,
  createOrUpdateVideoActions,
  bulkVideoActions,
  searchVideoActions,
  listVideoPurchaseActions,
  retrieveVideoPurchaseActions,
  numberVideoPurchaseActions,
  retrieveVideoAnalyticsActions,
  setVideoProviderActions,
  listVideoViewsActions,
  listVideoFilterableParamsActions,
  retrieveVideoAnalyticsByMemberActions,
  getPlaybackUrlActions,
} from './actions';
import { Video, VideoState } from './types';

const initialState: Immutable.Immutable<VideoState> = Immutable<VideoState>({
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
  analytics: {
    loading: false,
    data: null,
    error: null,
  },
  analyticsbyMember: {
    loading: false,
    error: null,
    data: null,
  },
  purchase: {
    loading: false,
    error: null,
    items: [],
    page: 1,
    count: 0,
    purchaseByMember: 0,
    byId: {},
  },
  views: {
    loading: false,
    error: null,
    items: [],
    page: 1,
    count: 0,
  },
  playbackUrl: {
    loading: false,
    error: null,
    accessDenied: false,
    byId: {},
  },
  filterableParams: {
    items: {
      SCTs: [],
      coaches: [],
    },
    loading: false,
    error: null,
  },
});

export default handleActions<Immutable.Immutable<VideoState>>(
  {
    [createOrUpdateVideoActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [createOrUpdateVideoActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [createOrUpdateVideoActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [retrieveVideoActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [retrieveVideoActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['loading'], payload);
    },
    [bulkVideoActions.success.toString()]: (state, { payload }: any) => {
      return state.merge(
        {
          byId: payload.reduce((acc: any, ps: any) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [bulkVideoActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['loading'], payload);
    },
    [listVideoActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listVideoActions.reset.toString()]: (state) => {
      return state.setIn(['list', 'allIds'], []);
    },
    [listVideoActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [setVideoProviderActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [listVideoActions.success.toString()]: (state, { payload }: any) => {
      const newAllIds =
        payload.page === 1
          ? payload.results.map((v: Video) => v.id)
          : // @ts-ignore
            [...state.list.allIds, ...payload.results.map((v: Video) => v.id)];
      return state
        .merge(
          {
            byId: payload.results.reduce(
              (acc: VideoState['byId'], ps: Video) => {
                acc[ps.id] = ps;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        )
        .setIn(['list', 'allIds'], newAllIds)
        .setIn(['list', 'page'], payload.page)
        .setIn(['list', 'nextPage'], payload.next_page);
    },
    [searchVideoActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['search', 'loading'], payload);
    },
    [searchVideoActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['search', 'error'], payload);
    },
    [searchVideoActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: { results: Video[]; page: number; next_page: number } },
    ) => {
      return state
        .merge(
          {
            byId: payload.results.reduce((acc: VideoState['byId'], ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(
          ['search', 'allIds'],
          payload.results.map((v) => v.id),
        )
        .setIn(['search', 'page'], payload.page)
        .setIn(['search', 'nextPage'], payload.next_page);
    },
    [listVideoPurchaseActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['purchase', 'loading'], payload);
    },
    [listVideoPurchaseActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['purchase', 'error'], payload);
    },
    [listVideoPurchaseActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state
        .setIn(['purchase', 'page'], payload.page)
        .setIn(['purchase', 'count'], payload.count)
        .setIn(['purchase', 'items'], payload.results)
        .merge(
          {
            purchase: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [retrieveVideoPurchaseActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['purchase', 'byId', payload.id], payload);
    },
    [retrieveVideoAnalyticsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['analytics', 'loading'], payload);
    },
    [retrieveVideoAnalyticsActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['analytics', 'error'], payload);
    },
    [retrieveVideoAnalyticsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['analytics', 'data'], payload);
    },
    [retrieveVideoAnalyticsByMemberActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['analyticsbyMember', 'loading'], payload);
    },
    [retrieveVideoAnalyticsByMemberActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['analyticsbyMember', 'error'], payload);
    },
    [retrieveVideoAnalyticsByMemberActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['analyticsbyMember', 'data'], payload);
    },
    [listVideoViewsActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['views', 'loading'], payload);
    },
    [listVideoViewsActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['views', 'error'], payload);
    },
    [listVideoViewsActions.success.toString()]: (state, { payload }: any) => {
      return state
        .setIn(['views', 'page'], payload.page)
        .setIn(['views', 'count'], payload.count)
        .setIn(['views', 'items'], payload.results);
    },
    [listVideoFilterableParamsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['filterableParams', 'loading'], payload);
    },
    [listVideoFilterableParamsActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['filterableParams', 'error'], payload);
    },
    [listVideoFilterableParamsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['filterableParams', 'items'], payload);
    },
    [numberVideoPurchaseActions.isLoading]: (state, { payload }) => {
      return state.setIn(['purchase', 'loading'], payload);
    },
    [numberVideoPurchaseActions.success]: (state, { payload }: any) => {
      return state.setIn(['purchase', 'purchaseByMember'], payload);
    },
    [getPlaybackUrlActions.isLoading]: (state, { payload }: any) => {
      return state.setIn(['playbackUrl', 'loading'], payload);
    },
    [getPlaybackUrlActions.error]: (state, { payload }: any) => {
      return state.setIn(['playbackUrl', 'error'], payload);
    },
    [getPlaybackUrlActions.accessDenied]: (state, { payload }: any) => {
      return state.setIn(['playbackUrl', 'accessDenied'], payload);
    },
    [getPlaybackUrlActions.success]: (state, { payload }: any) => {
      return state.setIn(
        ['playbackUrl', 'byId', payload.videoId],
        payload.playbackUrl,
      );
    },
  },
  initialState,
);
