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
  listingActions,
  metaActivityBulkActions,
  favoriteActions,
  metaActivityRestoreActions,
  metaActivityUpdateOrderActions,
  upsertMetaActivityCategoryActions,
  deleteMetaActivityCategoryActions,
  updateMetaActivityCategoryOrderActions,
  listAllMetaActivityCategoryActions,
} from './actions';
import { MetaActivity, MetaActivityState } from './types';

const initialState: Immutable.Immutable<MetaActivityState> =
  Immutable<MetaActivityState>({
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
        );
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
      return state.merge(
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
    [metaActivityBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [addImage.success.toString()]: (state, { payload }) => {
      const { image } = payload.image;
      const { images } = state.byId[payload.id];
      return state.setIn(
        ['byId', payload.id, 'images'],
        [image].concat(images),
      );
    },
    [removeImage.success.toString()]: (state, { payload }) => {
      const images = state.byId[payload.id].images.filter(
        (i) => i.id !== payload.imageId,
      );
      return state.setIn(['byId', payload.id, 'images'], images);
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
          payload.results.map((pp) => pp.id),
        )
        .merge(
          {
            metaActivityCategory: {
              byId: payload.results.reduce(
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
  },
  initialState,
);
