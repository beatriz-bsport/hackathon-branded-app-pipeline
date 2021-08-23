import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import type { CustomFormState } from './types';
import {
  fetchAllCustomFormActions,
  fetchCustomFormActions,
  upsertCustomFormActions,
  disableCustomFormActions,
  restoreCustomFormactions,
  disableCustomFormFieldActions,
  restoreCustomFormFieldActions,
  duplicateCustomFormActions,
  fetchMemberCustomFormFilledActions,
  submitCustomFormActions,
  fetchAllCustomFormStatisticsActions,
} from './actions';

const initialState: Immutable.Immutable<CustomFormState> = Immutable<CustomFormState>(
  {
    allIds: [],
    byId: {},
    loading: false,
    error: null,
    upsert: {
      loading: false,
      error: null,
    },
    filled: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    statistics: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
  },
);

export default handleActions(
  {
    [fetchAllCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchAllCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchAllCustomFormActions.success.toString()]: (state, { payload }) => {
      return state
        .set(
          'allIds',
          payload.results.map((cus) => cus.id),
        )
        .merge(
          {
            byId: payload.results.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    },
    [fetchCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchCustomFormActions.success.toString()]: (state, { payload }) => {
      if (!state.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['byId', payload.id], payload)
          .setIn(['allIds'], [...state.allIds, payload.id]);
      }
      return state.setIn(['byId', payload.id], payload);
    },
    [disableCustomFormActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [disableCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [restoreCustomFormactions.success.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [restoreCustomFormactions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [disableCustomFormFieldActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['byId', payload.formId, 'custom_form_field'],
        state.byId[payload.formId].custom_form_field.map((field) =>
          field.id !== payload.data.id ? field : payload.data,
        ),
      );
    },
    [restoreCustomFormFieldActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['byId', payload.formId], payload);
    },
    [upsertCustomFormActions.success.toString()]: (state, { payload }) => {
      if (!state.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['byId', payload.id], payload)
          .setIn(['allIds'], [...state.allIds, payload.id]);
      }
      return state.setIn(['byId', payload.id], payload);
    },
    [upsertCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [duplicateCustomFormActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['byId', payload.id], payload)
        .setIn(['allIds'], [...state.allIds, payload.id]);
    },
    [duplicateCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [duplicateCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [fetchMemberCustomFormFilledActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['filled', 'loading'], payload);
    },
    [fetchMemberCustomFormFilledActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['filled', 'error'], payload);
    },
    [fetchMemberCustomFormFilledActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['filled', 'allIds'],
          payload.results.map((cus) => cus.id),
        )
        .merge(
          {
            filled: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [submitCustomFormActions.success.toString()]: (state, { payload }) => {
      if (!state.allIds.find((id) => id === payload.id)) {
        return state
          .setIn(['filled', 'byId', payload.id], payload)
          .setIn(['filled', 'allIds'], [...state.filled.allIds, payload.id]);
      }
      return state.setIn(['filled', 'byId', payload.id], payload);
    },
    [submitCustomFormActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [submitCustomFormActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [fetchAllCustomFormStatisticsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['statistics', 'loading'], payload);
    },
    [fetchAllCustomFormStatisticsActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['statistics', 'error'], payload);
    },
    [fetchAllCustomFormStatisticsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['statistics', 'allIds'],
          payload.results.map((cus_stats) => cus_stats.id),
        )
        .merge(
          {
            statistics: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
  },
  initialState,
);
