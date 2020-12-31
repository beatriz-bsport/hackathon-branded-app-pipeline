import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  listIsLoading,
  listLoaded,
  listError,
  upsertIsLoading,
  upsertError,
  favoriteActions,
  actionStartUpdate,
  addImage,
  removeImage,
  detailActions,
  deleteActions,
  resetAction,
  associatedEstablishmentListActions,
  establishmentBulkRetrieveActions,
} from './actions.ts';
import { EstablishmentState } from './types.ts';

const initialState = Immutable<EstablishmentState>({
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  associatedEstablishment: {
    items: [],
    loading: false,
    error: null,
  },
  detail: {
    loading: false,
    error: null,
  },
  // Create or Update
  upsert: {
    loading: false,
    error: null,
  },
  favorite: {
    loading: false,
    error: null,
    id: null,
  },
  bulkRetrieve: {
    loading: false,
    error: null,
  },
  // Update
  updated: null,
});

export default handleActions(
  {
    [favoriteActions.isLoading]: (state, { payload }) => {
      return state.setIn(['favorite', 'loading'], payload);
    },
    [favoriteActions.error]: (state, { payload }) => {
      return state.setIn(['favorite', 'error'], payload);
    },
    [favoriteActions.success]: (state, { payload }) => {
      if (payload) {
        return state
          .setIn(['favorite', 'id'], payload.id)
          .setIn(['byId', payload.id], payload);
      }
      return state.setIn(['favorite', 'id'], null);
    },
    [establishmentBulkRetrieveActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bulkRetrieve', 'loading'], payload);
    },
    [establishmentBulkRetrieveActions.error]: (state, { payload }) => {
      return state.setIn(['bulkRetrieve', 'error'], payload);
    },
    [establishmentBulkRetrieveActions.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.results.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true }
      );
    },
    [resetAction.success]: (state) => {
      return state.setIn(['byId'], {}).setIn(['allIds'], []);
    },
    [deleteActions.success]: (state, { payload }) => {
      return state.without(['allIds', payload]).without(['byId', payload]);
    },
    [listIsLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [detailActions.success]: (state, { payload }) => {
      return state.merge({ byId: payload }, { deep: true });
    },
    [detailActions.error]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },
    [detailActions.isLoading]: (state, { payload }) => {
      return state.setIn(['detail', 'loading'], payload);
    },
    [listLoaded]: (state, { payload }) => {
      return state
        .merge({ byId: payload.establishmentDict }, { deep: true })
        .set('allIds', payload.establishmentIdList);
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
      return state.setIn(['byId', payload.id, 'loading'], payload.loading);
    },
    [addImage.success]: (state, { payload }) => {
      const { id, image } = payload;
      const { images } = state.byId[id];
      const newImages = images ? [image].concat(images) : [image];
      return state.setIn(['byId', id, 'images'], newImages);
    },
    [removeImage.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [associatedEstablishmentListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['associatedEstablishment', 'loading'], payload);
    },
    [associatedEstablishmentListActions.error]: (state, { payload }) => {
      return state.setIn(['associatedEstablishment', 'error'], payload);
    },
    [associatedEstablishmentListActions.success]: (state, { payload }) => {
      return state.setIn(['associatedEstablishment', 'items'], payload);
    },
  },
  initialState
) as () => EstablishmentState;
