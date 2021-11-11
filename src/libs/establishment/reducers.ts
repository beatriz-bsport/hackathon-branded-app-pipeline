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
  UpdateOrCreateEstablishmentsActionsV2,
  fetchAllEstablishmentGroupActions,
  upsertEstablishmentGroupActions,
  deleteEstablishmentGroupActions,
  fetchAllEstablishmentBillingGroupActions,
  upsertEstablishmentBillingGroupActions,
  deleteEstablishmentBillingGroupActions,
} from './actions';
import { EstablishmentBillingGroup, EstablishmentState } from './types';

const initialState: Immutable.Immutable<EstablishmentState> =
  Immutable<EstablishmentState>({
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
    // Establishment Group
    establishmentGroup: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      upsert: {
        loading: false,
        error: null,
      },
    },
    establishmentBillingGroup: {
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

export default handleActions(
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
    [establishmentBulkRetrieveActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['bulkRetrieve', 'loading'], payload);
    },
    [establishmentBulkRetrieveActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['bulkRetrieve', 'error'], payload);
    },
    [establishmentBulkRetrieveActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          byId: payload.results.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        },
        { deep: true },
      );
    },
    [resetAction]: (state) => {
      return state.setIn(['byId'], {}).setIn(['allIds'], []);
    },
    [deleteActions.success.toString()]: (state, { payload }) => {
      return state.without(['allIds', payload]).without(['byId', payload]);
    },
    [listIsLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [detailActions.success.toString()]: (state, { payload }) => {
      return state.merge({ byId: payload }, { deep: true });
    },
    [detailActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },
    [detailActions.isLoading.toString()]: (state, { payload }) => {
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
    [addImage.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id, 'loading'], payload.loading);
    },
    [addImage.success.toString()]: (state, { payload }) => {
      const { id, image } = payload;
      const { images } = state.byId[id];
      const newImages = images ? [image].concat(images) : [image];
      return state.setIn(['byId', id, 'images'], newImages);
    },
    [removeImage.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [associatedEstablishmentListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['associatedEstablishment', 'loading'], payload);
    },
    [associatedEstablishmentListActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['associatedEstablishment', 'error'], payload);
    },
    [associatedEstablishmentListActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['associatedEstablishment', 'items'], payload);
    },
    [UpdateOrCreateEstablishmentsActionsV2.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [UpdateOrCreateEstablishmentsActionsV2.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [UpdateOrCreateEstablishmentsActionsV2.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['byId', payload.id], payload.data);
    },
    [fetchAllEstablishmentGroupActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['establishmentGroup', 'loading'], payload);
    },
    [fetchAllEstablishmentGroupActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['establishmentGroup', 'error'], payload);
    },
    [fetchAllEstablishmentGroupActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['establishmentGroup', 'allIds'],
          payload.results.map((group) => group.id),
        )
        .merge(
          {
            establishmentGroup: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [upsertEstablishmentGroupActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['establishmentGroup', 'upsert', 'loading'], payload);
    },
    [upsertEstablishmentGroupActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['establishmentGroup', 'upsert', 'error'], payload);
    },
    [upsertEstablishmentGroupActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (!state.establishmentGroup.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['establishmentGroup', 'byId', payload.id], payload)
          .setIn(
            ['establishmentGroup', 'allIds'],
            [...state.establishmentGroup.allIds, payload.id],
          );
      }
      return state.setIn(['establishmentGroup', 'byId', payload.id], payload);
    },
    [deleteEstablishmentGroupActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['establishmentGroup', 'upsert', 'loading'], payload);
    },
    [deleteEstablishmentGroupActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['establishmentGroup', 'upsert', 'error'], payload);
    },
    [deleteEstablishmentGroupActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['establishmentGroup', 'allIds'],
        state.establishmentGroup.allIds.filter(
          (id: number) => id !== payload.id,
        ),
      );
    },
    [fetchAllEstablishmentBillingGroupActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['establishmentBillingGroup', 'loading'], payload);
    },
    [fetchAllEstablishmentBillingGroupActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['establishmentBillingGroup', 'error'], payload);
    },
    [fetchAllEstablishmentBillingGroupActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['establishmentBillingGroup', 'allIds'],
          payload.results.map(
            (billing_group: EstablishmentBillingGroup) => billing_group.id,
          ),
        )
        .merge(
          {
            establishmentBillingGroup: {
              byId: payload.results.reduce(
                (
                  acc: { [key: number]: EstablishmentBillingGroup },
                  ps: EstablishmentBillingGroup,
                ) => {
                  acc[ps.id] = ps;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [upsertEstablishmentBillingGroupActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['establishmentBillingGroup', 'upsert', 'loading'],
        payload,
      );
    },
    [upsertEstablishmentBillingGroupActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['establishmentBillingGroup', 'upsert', 'error'],
        payload,
      );
    },
    [upsertEstablishmentBillingGroupActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (
        !state.establishmentBillingGroup.allIds.find((id) => id === payload.id)
      ) {
        return state
          .setIn(['establishmentBillingGroup', 'byId', payload.id], payload)
          .setIn(
            ['establishmentBillingGroup', 'allIds'],
            [payload.id, ...state.establishmentBillingGroup.allIds],
          );
      }
      return state.setIn(
        ['establishmentBillingGroup', 'byId', payload.id],
        payload,
      );
    },
    [deleteEstablishmentBillingGroupActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['establishmentBillingGroup', 'upsert', 'loading'],
        payload,
      );
    },
    [deleteEstablishmentBillingGroupActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['establishmentBillingGroup', 'upsert', 'error'],
        payload,
      );
    },
    [deleteEstablishmentBillingGroupActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['establishmentBillingGroup', 'allIds'],
        state.establishmentBillingGroup.allIds.filter(
          (id: number) => id !== payload.id,
        ),
      );
    },
  },
  initialState,
);
