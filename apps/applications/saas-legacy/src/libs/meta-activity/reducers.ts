import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import uniq from 'lodash/uniq';

import {
  metaActivityListActions,
  metaActivityDetailActions,
  upsertActions,
  deleteAction,
  listingActions,
  workshopListingActions,
  metaActivityBulkActions,
  favoriteActions,
  metaActivityRestoreActions,
  metaActivityUpdateOrderActions,
  upsertMetaActivityCategoryActions,
  deleteMetaActivityCategoryActions,
  updateMetaActivityCategoryOrderActions,
  listAllMetaActivityCategoryActions,
  disabledMetaActivitiesActions,
  fetchIsMetaActivityPublishedOnUSCActions,
} from './actions';
import { MetaActivity, MetaActivityState } from './types';
import { PaginatedResponse } from '../../state/types';
import { prepareCacheKeys } from '../../utils/reduxHelper';

const initialState: Immutable.Immutable<MetaActivityState> =
  Immutable<MetaActivityState>({
    cachedIds: {},
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    favorite: {
      id: null,
      loading: false,
      error: null,
    },
    delete: {
      loading: false,
      error: null,
    },
    upsert: {
      data: null,
      loading: false,
      error: null,
    },
    workshop: {
      allIds: [],
    },
    metaActivityCategory: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      upsert: {
        loading: false,
        error: null,
      },
    },
    disabledMetaActivities: {
      allIds: [],
      page: null,
      next_page: null,
      count: 0,
      loading: false,
      error: null,
    },
    syncedOnPartnership: {
      USC: {},
    },
  });

export default handleActions<Immutable.Immutable<MetaActivityState>, any>(
  {
    [favoriteActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['favorite', 'loading'], payload);
    },
    [favoriteActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['favorite', 'error'], payload);
    },
    [favoriteActions.success.toString()]: (state, { payload }) => {
      if (payload) {
        return state
          .setIn(['favorite', 'id'], payload.id)
          .setIn(['byId', payload.id], payload);
      }
      return state.setIn(['favorite', 'id'], null);
    },
    [deleteAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['delete', 'loading'], payload);
    },
    [deleteAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['delete', 'error'], payload);
    },
    [deleteAction.success.toString()]: (state, { payload }) => {
      return state.set(
        'allIds',
        state.allIds.filter((id) => id !== payload),
      );
    },
    [metaActivityListActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [metaActivityListActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityListActions.success.toString()]: (
      state,
      { payload }: { payload: MetaActivity[] },
    ) => {
      return state
        .set(
          'allIds',
          payload.map((ma: MetaActivity) => ma.id),
        )
        .merge(
          {
            byId: payload.reduce(
              (acc: MetaActivityState['byId'], ps: MetaActivity) => {
                acc[ps.id] = ps;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        )
        .merge({ cachedIds: prepareCacheKeys(payload) }, { deep: true });
    },
    [metaActivityDetailActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [metaActivityDetailActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityDetailActions.success.toString()]: (state, { payload }) => {
      return state.merge({ byId: payload }, { deep: true });
    },
    [metaActivityBulkActions.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: payload.reduce(
              (acc: MetaActivityState['byId'], ps: MetaActivity) => {
                acc[ps.id] = ps;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        )
        .merge({ cachedIds: prepareCacheKeys(payload) }, { deep: true });
    },
    [metaActivityBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [upsertActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [upsertActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['byId', payload.id], payload)
        .setIn(['upsert', 'data'], payload);
    },
    [listingActions.success.toString()]: (state, { payload }) => {
      return state
        .set(
          'allIds',
          payload.map((ma: MetaActivity) => ma.id),
        )
        .merge(
          {
            byId: payload.reduce(
              (acc: MetaActivityState['byId'], ps: MetaActivity) => {
                acc[ps.id] = ps;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        );
    },
    [listingActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listingActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [workshopListingActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['workshop', 'allIds'],
          payload.map((ma: MetaActivity) => ma.id),
        )
        .merge(
          {
            byId: payload.reduce(
              (acc: MetaActivityState['byId'], ps: MetaActivity) => {
                acc[ps.id] = ps;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        );
    },
    [workshopListingActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [workshopListingActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityRestoreActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [metaActivityUpdateOrderActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [metaActivityUpdateOrderActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [metaActivityUpdateOrderActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          byId: payload.reduce(
            // @ts-expect-error
            (acc, curr) => ({ ...acc, [curr.id]: curr }),
            state.byId,
          ),
        },
        { deep: true },
      );
    },
    [listAllMetaActivityCategoryActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['metaActivityCategory', 'loading'], payload);
    },
    [listAllMetaActivityCategoryActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['metaActivityCategory', 'error'], payload);
    },
    [listAllMetaActivityCategoryActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['metaActivityCategory', 'allIds'],
          // @ts-expect-error
          payload.results.map((pp) => pp.id),
        )
        .merge(
          {
            metaActivityCategory: {
              byId: payload.results.reduce(
                // @ts-expect-error
                (acc, v) => ({ ...acc, [v.id]: v }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [upsertMetaActivityCategoryActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['metaActivityCategory', 'upsert', 'loading'],
        payload,
      );
    },
    [upsertMetaActivityCategoryActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['metaActivityCategory', 'upsert', 'error'], payload);
    },
    [upsertMetaActivityCategoryActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (!state.metaActivityCategory.allIds.includes(payload.id)) {
        return state
          .setIn(['metaActivityCategory', 'byId', payload.id], payload)
          .setIn(
            ['metaActivityCategory', 'allIds'],
            [...state.metaActivityCategory.allIds, payload.id],
          );
      }
      return state.setIn(['metaActivityCategory', 'byId', payload.id], payload);
    },
    [deleteMetaActivityCategoryActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['metaActivityCategory', 'upsert', 'loading'],
        payload,
      );
    },
    [deleteMetaActivityCategoryActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['metaActivityCategory', 'upsert', 'error'], payload);
    },
    [deleteMetaActivityCategoryActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['metaActivityCategory', 'allIds'],
        state.metaActivityCategory.allIds.filter((id) => id !== payload.id),
      );
    },
    [updateMetaActivityCategoryOrderActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          metaActivityCategory: {
            byId: payload.reduce(
              // @ts-expect-error
              (acc, cat) => ({ ...acc, [cat.id]: cat }),
              state.metaActivityCategory.byId,
            ),
          },
        },
        { deep: true },
      );
    },
    [updateMetaActivityCategoryOrderActions.loading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['metaActivityCategory', 'upsert', 'loading'],
        payload,
      );
    },
    [updateMetaActivityCategoryOrderActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['metaActivityCategory', 'upsert', 'error'], payload);
    },
    [disabledMetaActivitiesActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: PaginatedResponse<MetaActivity>;
      },
    ) => {
      const newIds = payload.results.map((ma) => ma.id);
      return state
        .setIn(
          ['disabledMetaActivities', 'allIds'],
          uniq([...state.disabledMetaActivities.allIds, ...newIds]),
        )
        .setIn(['disabledMetaActivities', 'count'], payload.count)
        .setIn(['disabledMetaActivities', 'page'], payload.page)
        .setIn(['disabledMetaActivities', 'next_page'], payload.next_page)
        .merge(
          {
            byId: payload.results.reduce(
              (acc: MetaActivityState['byId'], ma) => {
                acc[ma.id] = ma;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        );
    },
    [disabledMetaActivitiesActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['disabledMetaActivities', 'loading'], payload);
    },
    [disabledMetaActivitiesActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['disabledMetaActivities', 'error'], payload);
    },
    [disabledMetaActivitiesActions.add.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      const metaActivity = state.byId[payload];
      if (!metaActivity) return state;
      return state
        .setIn(
          ['disabledMetaActivities', 'allIds'],
          uniq([...state.disabledMetaActivities.allIds, payload]),
        )
        .setIn(
          ['disabledMetaActivities', 'count'],
          state.disabledMetaActivities.count + 1,
        );
    },
    [disabledMetaActivitiesActions.remove.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state
        .setIn(['allIds'], uniq([...state.allIds, payload]))
        .setIn(
          ['disabledMetaActivities', 'allIds'],
          state.disabledMetaActivities.allIds.filter((id) => id !== payload),
        )
        .setIn(
          ['disabledMetaActivities', 'count'],
          state.disabledMetaActivities.count - 1,
        );
    },
    [fetchIsMetaActivityPublishedOnUSCActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number; isPublished: boolean } },
    ) => {
      return state.setIn(
        ['syncedOnPartnership', 'USC', payload.id],
        payload.isPublished,
      );
    },
  },
  initialState,
);
